import type { InventoryService } from './useTable';

import { computed, defineComponent, h } from 'vue';

import { connect, mapProps, RecursionField, useField } from '@formily/vue';

// —— 直接复用你现有的业务模块 —— //
import { getDefaultProductItem, useProductColumns } from './product-config';
import { useProductTable } from './useTable';

// 业务类型
type TableType =
  | 'default'
  | 'physical'
  | 'receipt'
  | 'return'
  | 'spoilage'
  | 'stock'
  | 'transfer';

type Col = {
  align?: 'center' | 'left' | 'right';
  label: string;
  prop: string;
  required?: boolean;
  type?: 'custom' | 'date' | 'input' | 'number' | 'select';
  width?: number | string;
};

// 把列描述映射为 Formily 组件名
function toFieldComponentType(col: Col) {
  switch (col.type) {
    case 'input': {
      return 'Input';
    }
    case 'number': {
      return 'InputNumber';
    }
    case 'select': {
      return 'Select';
    }
    default: {
      return 'PreviewText.Input';
    } // 只读显示
  }
}

const Core = defineComponent({
  name: 'ProductArrayTable',
  props: {
    merchantId: { type: String, required: true },
    type: { type: String as () => TableType, default: 'default' },
    externalData: {
      type: Array as () => any[] | undefined,
      default: undefined,
    },
    InventoryService: {
      type: Object as () => InventoryService,
      required: true,
    },
    initialWarehouseId: { type: [String, Number], default: undefined },
  },
  setup(props) {
    // 当前字段（必须是 array）
    const field = useField();

    // 列集合（来自你的 useProductColumns）
    const { getColumnsByType } = useProductColumns(props.type as TableType);
    const displayColumns = computed<Col[]>(() =>
      getColumnsByType(props.type as TableType),
    );

    // 表格业务能力（来自你的 useProductTable）
    const {
      productSelectList,
      filterProductSku,
      getSkuProductList,
      safeParseFloat,
      calculateTax,
      handleBarcodeScan,
      switchToExternalData,
      switchToInternal,
      currentWarehouseId,
      updateWarehouseId,
      skuGroups,
      updateSkuGroups,
      objectSpanMethod,
    } = useProductTable(
      props.merchantId,
      props.InventoryService,
      props.externalData,
      props.type as TableType,
      props.initialWarehouseId,
    );

    // 首次拉一遍候选
    getSkuProductList();

    // 生成“把当前字段渲染为 ArrayTable”的 schema 片段（纯 JS 对象）
    const innerSchema = computed(() => {
      // 索引列
      // const idxCol = {
      //   type: 'void',
      //   'x-component': 'ArrayTable.Column',
      //   'x-component-props': { title: '#', width: 56, align: 'center' },
      //   properties: {
      //     index: { type: 'void', 'x-component': 'ArrayTable.Index' },
      //   },
      // };

      // 动态业务列
      const bizCols = displayColumns.value.map((col) => {
        const comp = toFieldComponentType(col);
        const node: any = {
          type: 'void',
          'x-component': 'ArrayTable.Column',
          'x-component-props': {
            title: col.label,
            width: col.width ?? 150,
            align: col.align ?? 'left',
          },
          properties: {},
        };

        node.properties[col.prop] = {
          type: comp === 'InputNumber' ? 'number' : 'string',
          'x-decorator': 'FormItem',
          'x-component': comp,
          required: !!col.required,
          'x-component-props':
            comp === 'Select'
              ? {
                  filterable: true,
                  remote: true,
                  remoteMethod: (q: string) => filterProductSku(q),
                }
              : {},
        };

        // 常见字段微调
        if (
          ['enter_quantity', 'purchase_qty', 'transfer_quantity'].includes(
            col.prop,
          )
        ) {
          node.properties[col.prop]['x-component'] = 'InputNumber';
          node.properties[col.prop].type = 'number';
          node.properties[col.prop]['x-component-props'] = {
            min: 0,
            precision: 0,
          };
        }
        if (['cost_price', 'product_cost_price'].includes(col.prop)) {
          node.properties[col.prop]['x-component'] = 'InputNumber';
          node.properties[col.prop].type = 'number';
          node.properties[col.prop]['x-component-props'] = {
            min: 0,
            precision: 2,
          };
        }

        // 示例：调拨金额联动
        if (props.type === 'transfer' && col.prop === 'transfer_amount') {
          node.properties[col.prop] = {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'PreviewText.Input',
            'x-reactions': [
              {
                dependencies: ['.transfer_quantity', '.product_cost_price'],
                fulfill: {
                  state: {
                    value:
                      '{{$deps[0] && $deps[1] ? (+$deps[0] * +$deps[1]).toFixed(2) : ""}}',
                  },
                },
              },
            ],
          };
        }

        return node;
      });

      // 操作列
      const actionCol = {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': { title: '操作', width: 120, align: 'center' },
        properties: {
          remove: { type: 'void', 'x-component': 'ArrayTable.Remove' },
          moveDown: { type: 'void', 'x-component': 'ArrayTable.MoveDown' },
          moveUp: { type: 'void', 'x-component': 'ArrayTable.MoveUp' },
        },
      };

      return {
        type: 'array',
        'x-component': 'ArrayTable',
        'x-component-props': {
          // 透传合并行算法（条码分组等）
          spanMethod: (args: any) =>
            objectSpanMethod(args, displayColumns.value),
        },
        items: {
          type: 'object',
          properties: {
            ...Object.fromEntries(bizCols.map((c, i) => [`__col_${i}`, c])),
            actionCol,
          },
        },
        properties: {
          addition: {
            type: 'void',
            title: '添加商品',
            'x-component': 'ArrayTable.Addition',
            'x-component-props': { defaultValue: getDefaultProductItem() },
          },
        },
      };
    });

    // 可选：暴露扫码方法
    function onBarcode(scanned: any) {
      const list = Array.isArray(field.value) ? (field.value as any[]) : [];
      handleBarcodeScan(scanned, list, {
        onProductAdd: (updated: any[]) => (field.value = updated),
        onProductChange: () => {},
        onQuantityChange: () => {},
      });
    }

    // 供父层通过 ref 使用（<Field x-component-props ref="...">）
    (field as any).componentRef = { onBarcode };

    return () =>
      h(RecursionField, {
        schema: innerSchema.value,
        name: field.value.props.name,
      });
  },
});

// 通过 connect 接入 readPretty / disabled 等通用受控属性
export default connect(Core, mapProps({ readOnly: 'readPretty' }));
export { Core as ProductArrayTableCore };
