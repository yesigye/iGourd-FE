// 列定义辅助函数
import type { ColumnDescriptor } from '../types';

import { ScanCodeEntry } from '#/components';

/**
 * 创建基础列配置
 */
export const createBaseColumns = (): ColumnDescriptor[] => [
  {
    name: 'product_code',
    type: 'string',
    title: '{{t("common.purchase.product_code")}}',
    'x-component-props': {
      width: 160,
    },
    'x-component': 'PreviewText.Input',
  },
  {
    name: 'major_name',
    type: 'string',
    title: 'product_id',
    'x-hidden': true,
  },
  {
    name: 'product_id',
    type: 'string',
    title: '{{t("common.purchase.major_name")}}',
    'x-component-props': {
      width: 260,
    },
    'x-component': 'ProductTable.ProductCell',
    'x-decorator': 'FormItem',
    required: true,
    'x-content': {
      header: ScanCodeEntry,
    },
  },
  {
    name: 'sku_barcode',
    type: 'string',
    title: '{{t("common.purchase.product_barcode")}}',
    'x-component-props': {
      width: 160,
    },
    'x-component': 'PreviewText.Input',
  },
  {
    name: 'display_quantity',
    title: '数量',
    'x-component-props': {
      width: 140,
      precision: 8,
    },
    'x-component': 'ProductTable.QuantityCell',
    'x-decorator': 'FormItem',
    required: true,
  },
  {
    name: 'ware_house',
    title: '{{t("common.warehouse")}}',
    'x-component-props': {
      width: 160,
    },
    'x-decorator': 'FormItem',
    'x-component': 'Select',
    'x-reactions': {
      dependencies: ['warehouse_id'],
      fulfill: {
        state: {
          dataSource: '{{ warehouse.value }}',
          value: '{{$deps[0]}}',
        },
      },
    },
  },
  {
    name: 'product_unit_code',
    title: '{{t("common.purchase.sub_product_stock_search_models")}}',
    'x-component-props': {
      width: 150,
    },
    'x-component': 'ProductTable.UnitCell',
    'x-decorator': 'FormItem',
  },
  {
    name: 'basic_unit_radio',
    type: 'number',
    'x-hidden': true,
  },
  {
    name: 'basic_unit_radio_display',
    title: '{{t("common.purchase.basic_unit_radio")}}',
    type: 'void',
    'x-component-props': {
      width: 160,
    },
    'x-decorator': 'FormItem',
    'x-component': 'PreviewText.Input',
    'x-reactions': {
      fulfill: {
        state: {
          value: '{{$self.value ? "1:"+ $self.value: "" }}',
        },
      },
    },
  },
  {
    name: 'major_unit_name',
    title: '{{t("common.purchase.major_unit_name")}}',
    'x-component-props': {
      width: 100,
    },
    'x-component': 'PreviewText.Input',
  },
  {
    name: 'cost_price',
    type: 'number',
    title: '{{t("common.purchase.cost_price")}}',
    'x-component-props': {
      width: 140,
    },
    'x-component': 'PreviewText.Input',
    'x-decorator': 'FormItem',
    required: true,
  },
  {
    name: 'total_amount',
    type: 'number',
    title: '{{t("common.purchase.total_amount")}}',
    'x-component-props': {
      width: 200,
    },
    'x-component': 'PreviewText.Input',
    'x-decorator': 'FormItem',
  },
  {
    name: 'product_spec_kvmessage',
    title: '{{t("common.purchase.product_spec_kvmessage")}}',
    'x-component-props': {
      width: 200,
    },
    'x-component': 'PreviewText.Input',
    'x-decorator': 'FormItem',
  },
];

/**
 * 创建数量列
 */
export const createQuantityColumn = (
  name: string,
  title: string,
  component: string = 'InputNumber',
  maxField?: string,
): ColumnDescriptor => ({
  name,
  type: 'number',
  title,
  'x-component': component,
  'x-component-props': {
    width: 160,
    min: 0,
  },
  'x-reactions': {
    fulfill: {
      state: {
        componentProps: {
          max: maxField
            ? `{{$values?.${maxField} ? $record?.${maxField} : Number.MAX_SAFE_INTEGER}}`
            : 'Number.MAX_SAFE_INTEGER',
        },
      },
    },
  },
});

/**
 * 创建简化模式的列配置
 */
export const createSimpleColumns = (): ColumnDescriptor[] => [
  {
    name: 'major_name',
    type: 'string',
    title: 'product_id',
    'x-hidden': true,
  },
  {
    name: 'product_id',
    title: '商品',
    'x-component-props': {
      width: 260,
    },
    'x-component': 'ProductTable.ProductCell',
    'x-decorator': 'FormItem',
    required: true,
  },
  {
    name: 'unit_select',
    title: '单位',
    'x-component-props': {
      width: 160,
    },
    'x-component': 'ProductTable.UnitCell',
    'x-decorator': 'FormItem',
  },
  /*
  {
    name: 'sku_id',
    title: 'SKU',
    'x-component-props': {
      width: 200,
    },
    'x-component': 'PreviewText.Input',
    'x-decorator': 'FormItem',
  },
  */
  {
    name: 'display_quantity',
    title: '数量',
    'x-component-props': {
      width: 140,
      precision: 8,
    },
    'x-component': 'ProductTable.QuantityCell',
    'x-decorator': 'FormItem',
    required: true,
  },
  {
    name: 'quantity_base',
    title: '基础数量',
    'x-component-props': {
      width: 120,
    },
    'x-component': 'ReadonlyNumber',
  },
  {
    name: 'remark',
    title: '备注',
    'x-component-props': {
      width: 180,
    },
    'x-component': 'Input',
  },
];
