import type { ISchema } from '@igourd/common-ui';

const baseColumns: ISchema[] = [
  {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      width: 80,
      title: '#',
      align: 'center',
    },
    properties: {
      index: {
        type: 'void',
        'x-component': 'ArrayTable.Index',
      },
    },
  },
  {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      title: "{{t('common.purchase.product_code')}}",
      width: 150,
      align: 'left',
    },
    properties: {
      product_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'PreviewText.Input',
      },
    },
  },
  {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      title: "{{t('common.purchase.major_name')}}",
      width: 270,
    },
    properties: {
      major_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'ProductSelect',
      },
    },
  },
  {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      title: "{{t('common.purchase.product_barcode')}}",
      width: 170,
    },
    properties: {
      sku_barcode: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'PreviewText.Input',
      },
    },
  },
  {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      title: "{{t('purchase.initial_stock_warehouse_name')}}",
      width: 170,
    },
    properties: {
      // TODO 选择
      sale_warehouse_id: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-reactions': {
          fulfill: {
            state: {
              dataSource: '{{ warehouse.value }}',
            },
          },
        },
      },
    },
  },
  // {
  //   type: 'void',
  //   'x-component': 'ArrayTable.Column',
  //   'x-component-props': {
  //     title: "{{t('common.purchase.quantity')}}",
  //     width: 200,
  //     required: true,
  //   },
  //   properties: {
  //     enter_quantity: {
  //       type: 'string',
  //       'x-decorator': 'FormItem',
  //       'x-component': 'Input',
  //     },
  //   },
  // },
  // {
  //   type: 'void',
  //   'x-component': 'ArrayTable.Column',
  //   'x-component-props': {
  //     title: "{{t('common.purchase.product_spec_kvmessage')}}",
  //     width: 150,
  //   },
  //   properties: {
  //     product_spec_kvmessage: {
  //       type: 'string',
  //       'x-decorator': 'FormItem',
  //       'x-component': 'PreviewText.Input',
  //     },
  //   },
  // },
  {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      title: "{{t('common.purchase.sub_product_stock_search_models')}}",
      width: 150,
    },
    properties: {
      // TODO 选择 选择的单位从哪里来？
      product_unit_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
    },
  },
  {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      title: "{{t('common.purchase.basic_unit_radio')}}",
      width: 150,
    },
    properties: {
      // TODO 根据类型取不同的值
      transfer_quantity: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  },
  {
    type: 'void',
    'x-component': 'ArrayTable.Column',
    'x-component-props': {
      title: "{{t('common.purchase.purchase_qty')}}",
      width: 150,
    },
    properties: {
      major_unit_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  },
  // {
  //   type: 'void',
  //   'x-component': 'ArrayTable.Column',
  //   'x-component-props': {
  //     title: "{{t('common.purchase.cost_price')}}",
  //     width: 150,
  //   },
  //   properties: {
  //     cost_price: {
  //       type: 'string',
  //       'x-decorator': 'FormItem',
  //       'x-component': 'Input',
  //     },
  //   },
  // },
];

// const stockColumns = [
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.stock_add_quantity')}}",
//       width: 150,
//     },
//     properties: {
//       stock_add_quantity: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.stock_warning_quantity')}}",
//       width: 150,
//     },
//     properties: {
//       stock_warning_quantity: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
// ];

// const physicalColumns: ISchema[] = [
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.stock_total_quantity')}}",
//       width: 160,
//     },
//     properties: {
//       origin_quantity_message: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.stock_total_quantity_message')}}",
//       width: 160,
//     },
//     properties: {
//       sale_warehouse_product_stock_quantity_message: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('inventory.quantityDifference')}}",
//       width: 200,
//     },
//     properties: {
//       variance_quantity: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
// ];

// const receiptColumns: ISchema[] = [
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.actual_quantity')}}",
//       width: 150,
//     },
//     properties: {
//       actual_quantity: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
// ];

// const returnColumns: ISchema[] = [
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.returned_quantity')}}",
//       width: 150,
//     },
//     properties: {
//       returned_quantity: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
// ];

// const spoilageColumns: ISchema[] = [
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.stock_total_quantity')}}",
//       width: 160,
//     },
//     properties: {
//       sale_warehouse_product_stock_quantity: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.stock_total_quantity_message')}}",
//       width: 160,
//     },
//     properties: {
//       sale_warehouse_product_stock_quantity_message: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
// ];

// const transferColumns: ISchema[] = [
//   {
//     type: 'void',
//     'x-component': 'ArrayTable.Column',
//     'x-component-props': {
//       title: "{{t('common.purchase.transfer_amount')}}",
//       width: 150,
//     },
//     properties: {
//       transfer_amount: {
//         type: 'string',
//         'x-decorator': 'FormItem',
//         'x-component': 'Input',
//       },
//     },
//   },
// ];

export function schemaBuilder() {
  const allColumns = [
    ...baseColumns,
    // ...stockColumns,
    // ...physicalColumns,
    // ...receiptColumns,
    // ...returnColumns,
    // ...spoilageColumns,
    // ...transferColumns,
  ];
  const properties: Record<string, unknown> = {};

  allColumns.forEach((colunm, index) => {
    properties[`colunm${index}`] = colunm;
  });
  return {
    type: 'array',
    'x-component': 'ArrayTable',
    items: {
      type: 'object',
      properties,
    },
    properties: {
      addition: {
        type: 'array',
        title: '添加商品',
        'x-component': 'ArrayTable.Addition',
      },
    },
  };
}
