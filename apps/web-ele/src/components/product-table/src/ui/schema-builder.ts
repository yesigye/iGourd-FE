/* ui/schema-builder.ts */
import type { ISchema } from '@igourd/common-ui';

import type { ColumnDescriptor, Ctx } from '../types';

/** 可选项：表格 props / 索引列 / 操作列 / 新增按钮 / 行合并 */
export type BuildSchemaOptions = {
  addition?: {
    method?: 'push' | 'unshift';
    title?: string;
  };
  operations?: {
    moveDown?: boolean;
    moveUp?: boolean;
    remove?: boolean;
    title?: string;
    width?: number | string;
  };
  showIndex?: boolean;
  /** element-plus Table 的 span-method */
  spanMethod?: any;
  tableProps?: Record<string, any>;
};

/** 单列 → Markup Schema：列 = ArrayTable.Column；列下挂实际字段组件 */
function toSchemaColumn(desc: ColumnDescriptor): ISchema {
  const component = desc.component ?? 'Input';
  const node: ISchema = {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-content': desc.headerContent,
    'x-hidden': desc.hidden,
    'x-component-props': {
      title: desc.title,
      width: desc.width,
      align: desc.align,
      // 表头必填星标（也可由内部 FormItem 的 required 自动控制）
      asterisk: typeof desc.required === 'boolean' ? desc.required : undefined,
    },
    properties: {
      // 真正的单元格字段挂在列下面（官方 Markup Schema 风格）
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [desc.key]: {
        type: desc.type ?? 'string',
        'x-decorator': desc.decorator ?? 'FormItem',
        'x-component': component,
        'x-component-props': desc.props ?? {},
        'x-reactions': desc.reactions,
        'x-validator': desc.validator,
        'x-read-pretty': !!desc.readonly,
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
    operations = {
      remove: true,
      moveUp: false,
      moveDown: false,
      title: '操作',
      width: 120,
    },
    addition = { title: '添加', method: 'push' },
    spanMethod,
  } = opts;
  // 先按 visibleWhen 过滤列
  const visCols = columns.filter((c) =>
    c.visibleWhen ? !!c.visibleWhen(ctx) : true,
  );

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

  // 操作列（避免额外依赖 Space，这里直接渲染三个内置按钮组件）
  const hasOps = !!(
    operations.remove ||
    operations.moveUp ||
    operations.moveDown
  );
  const opCol: ISchema | undefined = hasOps
    ? {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: operations.title ?? '操作',
          width: operations.width ?? 120,
          fixed: 'right',
          align: 'center',
        },
        properties: {
          ...(operations.moveUp
            ? {
                up: {
                  type: 'void',
                  'x-component': 'ArrayTable.MoveUp',
                  title: '上移',
                },
              }
            : {}),
          ...(operations.moveDown
            ? {
                down: {
                  type: 'void',
                  'x-component': 'ArrayTable.MoveDown',
                  title: '下移',
                },
              }
            : {}),
          ...(operations.remove
            ? {
                remove: {
                  type: 'void',
                  'x-component': 'ArrayTable.Remove',
                  title: '删除',
                },
              }
            : {}),
        },
      }
    : undefined;

  // 新增按钮
  const additionNode: ISchema = {
    type: 'void',
    title: addition.title ?? '添加',
    'x-component': 'ArrayTable.Addition',
    'x-component-props': {
      method: addition.method ?? 'push',
      defaultValue: { warehouse_id: ctx.warehouseId },
    },
  };

  // 组装最终 schema（不再把字段折叠到 items.properties！）
  const schema: ISchema = {
    type: 'array',
    'x-decorator': 'FormItem',
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
    }, // 字段都挂在列下，不需要提前声明 properties
    properties: {
      addition: additionNode,
    },
  };

  return schema;
}
