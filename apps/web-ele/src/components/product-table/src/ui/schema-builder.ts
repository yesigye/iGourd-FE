/* ui/schema-builder.ts */
import type { ISchema, observable } from '@igourd/common-ui';

import type { ColumnDescriptor, Ctx } from '../types';

import { omit } from '@igourd/utils';

/** 可选项：表格 props / 索引列 / 操作列 / 新增按钮 / 行合并 */
export type BuildSchemaOptions = {
  addition?: {
    method?: 'push' | 'unshift';
    title?: string;
  };
  canOperate?: ReturnType<typeof observable<{ value: boolean }>>;
  showIndex?: boolean;
  /** element-plus Table 的 span-method */
  spanMethod?: any;
  tableProps?: Record<string, any>;
};

/** 单列 → Markup Schema：列 = ArrayTable.Column；列下挂实际字段组件 */
function toSchemaColumn(desc: ColumnDescriptor): ISchema {
  const fieldName = desc.name;

  // 直接展开列定义，只添加 ArrayTable.Column 包装
  const node: ISchema = {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-content': desc['x-content'],
    'x-hidden': desc['x-hidden'],
    'x-component-props': {
      title: desc.title,
      width: desc['x-component-props']?.width,
      // 表头必填星标
      asterisk: desc['x-decorator-props']?.required,
    },
    'x-reactions': desc['x-col-reactions'],
    properties: {
      // 直接展开字段定义，保持所有原有属性
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [fieldName]: {
        ...omit(desc, ['x-col-reactions']), // 展开所有原始属性
        name: fieldName,
        title: undefined,
      },
    },
  };
  return node;
}

/** ✅ 标准 Markup Schema 的 ArrayTable 生成器 */
export function buildSchema(
  columns: ColumnDescriptor[],
  ctx: Ctx,
  opts: BuildSchemaOptions = {},
): ISchema {
  const {
    tableProps = {},
    showIndex = true,
    canOperate = { value: true },
    spanMethod,
  } = opts;
  // 过滤列（目前所有列都显示）
  const visCols = columns;

  // 构建列节点（每一列一个 ArrayTable.Column，列下即是字段）
  const colNodes: Record<string, ISchema> = {};
  visCols.forEach((c, i) => (colNodes[`col_${i}`] = toSchemaColumn(c)));

  // 索引列（可选）
  const indexCol: ISchema | undefined = showIndex
    ? {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: '#',
          width: 60,
          align: 'center',
          fixed: 'left',
        },
        properties: {
          index: { type: 'void', 'x-component': 'ArrayTable.Index' },
        },
      }
    : undefined;

  const opCol: ISchema | undefined = {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      title: "{{ t('common.action') }}",
      width: 220,
      fixed: 'right',
      align: 'center',
    },
    'x-hidden': !canOperate.value,
    properties: {
      create: {
        type: 'void',
        'x-component': 'ArrayTable.Addition',
        title: '{{t("common.create")}}',
      },
      remove: {
        type: 'void',
        'x-component': 'ArrayTable.Remove',
        title: '{{t("common.delete")}}',
      },
    },
  };

  // // 新增按钮
  // const additionNode: ISchema = {
  //   type: 'void',
  //   title: addition.title ?? '添加',
  //   'x-component': 'ArrayTable.Addition',
  //   'x-component-props': {
  //     method: addition.method ?? 'push',
  //     defaultValue: { warehouse_id: ctx.warehouseId },
  //   },
  // };

  // 组装最终 schema（不再把字段折叠到 items.properties！）
  const schema: ISchema = {
    type: 'array',
    'x-component': 'ArrayTable',
    'x-component-props': {
      ...tableProps,
      ...(spanMethod ? { spanMethod } : {}),
    },
    items: {
      type: 'object',
      properties: {
        ...(indexCol ? { indexCol } : {}),
        ...colNodes,
        ...(opCol ? { operations: opCol } : {}),
      },
    }, // 字段都挂在列下，不需要提前声明 propertie
  };

  return schema;
}
