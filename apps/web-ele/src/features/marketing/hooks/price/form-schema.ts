import type { ISchema } from '@igourd/common-ui';

export default {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 10,
      },
      properties: {
        card_0: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: "{{t('priceLevel.form.name')}}",
            class: 'mb-10',
          },
          properties: {
            name: {
              type: 'string',
              title: "{{t('priceLevel.form.name')}}",
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                maxLength: 64,
                placeholder: "{{t('priceLevel.placeholder.name')}}",
              },
              'x-validator': [
                {
                  required: true,
                  message: "{{t('priceLevel.validate.name.required')}}",
                },
              ],
            },
            thres: {
              type: 'void',
              'x-component': 'Space',
              'x-component-props': {},
              properties: {
                change_type: {
                  type: 'string',
                  title: "{{t('priceLevel.form.changeType')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: "{{t('priceLevel.placeholder.changeType')}}",
                    style: { width: '175px' },
                  },
                  enum: [
                    {
                      label: "{{t('priceLevel.enum.changeType.decrease')}}",
                      value: 'DECREASE',
                    },
                    {
                      label: "{{t('priceLevel.enum.changeType.increase')}}",
                      value: 'INCREASE',
                    },
                  ],
                  'x-validator': [
                    {
                      required: true,
                      message:
                        "{{t('priceLevel.validate.changeType.required')}}",
                    },
                  ],
                },
                change_mode: {
                  type: 'string',
                  title: "{{t('priceLevel.form.changeMode')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: "{{t('priceLevel.placeholder.changeMode')}}",
                    style: { width: '175px' },
                  },
                  enum: [
                    {
                      label: "{{t('priceLevel.enum.changeMode.amount')}}",
                      value: 'AMOUNT',
                    },
                    {
                      label: "{{t('priceLevel.enum.changeMode.percentage')}}",
                      value: 'PERCENTAGE',
                    },
                  ],
                  'x-validator': [
                    {
                      required: true,
                      message:
                        "{{t('priceLevel.validate.changeMode.required')}}",
                    },
                  ],
                },

                change_value: {
                  type: 'number',
                  title: "{{t('priceLevel.form.changeValue')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    placeholder: "{{t('priceLevel.placeholder.changeValue')}}",
                    style: { width: '300px' },
                  },
                  'x-reactions': [
                    {
                      dependencies: ['change_mode'],
                      fulfill: {
                        state: {
                          componentProps:
                            "{{$deps[0]==='PERCENTAGE' ? { min:0, max:100, step:0.1 } : { min:0, step:0.01 } }}",
                        },
                      },
                    },
                  ],
                  'x-validator': [
                    {
                      required: true,
                      message:
                        "{{t('priceLevel.validate.changeValue.required')}}",
                    },
                  ],
                },
              },
            },
            status: {
              type: 'string',
              title: "{{t('priceLevel.form.status')}}",
              default: 'OPEN',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
              'x-component-props': {
                activeValue: 'OPEN',
                inactiveValue: 'CLOSE',
              },
            },
          },
        },
        card_1: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: "{{t('priceLevel.form.name')}}",
            class: 'mb-10',
          },
          properties: {
            effective_time: {
              type: 'string',
              title: "{{t('priceLevel.form.effectiveTime')}}",
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'date',
                valueFormat: 'YYYY-MM-DD 00:00:00',
                placeholder: "{{t('priceLevel.placeholder.effectiveTime')}}",
              },
              'x-validator': [
                {
                  required: true,
                  message:
                    "{{t('priceLevel.validate.effectiveTime.required')}}",
                },
              ],
            },

            expiration_time: {
              type: 'string',
              title: "{{t('priceLevel.form.expirationTime')}}",
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'date',
                valueFormat: 'YYYY-MM-DD 23:59:59',
                placeholder: "{{t('priceLevel.placeholder.expirationTime')}}",
              },
              'x-validator': [
                {
                  required: true,
                  message:
                    "{{t('priceLevel.validate.expirationTime.required')}}",
                },
                // {
                //   validator:
                //     "{{$self.value && $form.values.effective_time && new Date($self.value) < new Date($form.values.effective_time) ? t('priceLevel.validate.expirationTime.gteEffective') : ''}}",
                // },
              ],
            },
          },
        },
        card_2: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: "{{t('priceLevel.form.name')}}",
            class: 'mb-6',
          },
          properties: {
            relation_type: {
              type: 'string',
              title: "{{t('priceLevel.form.relationType')}}",
              default: 'ALL',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              enum: [
                {
                  label: "{{t('priceLevel.enum.relation.all')}}",
                  value: 'ALL',
                },
                {
                  label: "{{t('priceLevel.enum.relation.group')}}",
                  value: 'PRODUCT_GROUP',
                },
                {
                  label: "{{t('priceLevel.enum.relation.label')}}",
                  value: 'PRODUCT_LABEL',
                },
                {
                  label: "{{t('priceLevel.enum.relation.product')}}",
                  value: 'PRODUCT',
                },
              ],
              'x-validator': [
                {
                  required: true,
                  message: "{{t('priceLevel.validate.relationType.required')}}",
                },
              ],
            },
            relation_product_group_id_list: {
              type: 'array',
              title: "{{t('priceLevel.form.productGroups')}}",
              'x-decorator': 'FormItem',
              'x-component': 'ArrayTable',
              'x-reactions': {
                dependencies: ['relation_type'],
                fulfill: {
                  state: { visible: "{{$deps[0]==='PRODUCT_GROUP'}}" },
                },
              },
              items: {
                type: 'object',
                properties: {
                  index: {
                    type: 'void',
                    'x-component': 'ArrayTable.Index',
                    'x-component-props': { width: 60, title: '#' },
                  },
                  id: {
                    type: 'number',
                    title: "{{t('priceLevel.table.columns.group')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      filterable: true,
                      placeholder:
                        "{{t('priceLevel.placeholder.productGroup')}}",
                    },
                    enum: [],
                  },
                  remove: {
                    type: 'void',
                    title: "{{t('priceLevel.table.columns.ops')}}",
                    'x-component': 'ArrayTable.Remove',
                  },
                },
              },
              properties: {
                addition: {
                  type: 'void',
                  title: "{{t('priceLevel.form.add')}}",
                  'x-component': 'ArrayTable.Addition',
                },
              },
            },

            relation_product_label_id_list: {
              type: 'array',
              title: "{{t('priceLevel.form.productLabels')}}",
              'x-decorator': 'FormItem',
              'x-component': 'ArrayTable',
              'x-reactions': {
                dependencies: ['relation_type'],
                fulfill: {
                  state: { visible: "{{$deps[0]==='PRODUCT_LABEL'}}" },
                },
              },
              items: {
                type: 'object',
                properties: {
                  index: {
                    type: 'void',
                    'x-component': 'ArrayTable.Index',
                    'x-component-props': { width: 60, title: '#' },
                  },
                  id: {
                    type: 'number',
                    title: "{{t('priceLevel.table.columns.label')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      filterable: true,
                      placeholder:
                        "{{t('priceLevel.placeholder.productLabel')}}",
                    },
                    enum: [],
                  },
                  remove: {
                    type: 'void',
                    title: "{{t('priceLevel.table.columns.ops')}}",
                    'x-component': 'ArrayTable.Remove',
                  },
                },
              },
              properties: {
                addition: {
                  type: 'void',
                  title: "{{t('priceLevel.form.add')}}",
                  'x-component': 'ArrayTable.Addition',
                },
              },
            },

            relation_product_id_list: {
              type: 'array',
              title: "{{t('priceLevel.form.products')}}",
              'x-decorator': 'FormItem',
              'x-component': 'ArrayTable',
              'x-reactions': {
                dependencies: ['relation_type'],
                fulfill: { state: { visible: "{{$deps[0]==='PRODUCT'}}" } },
              },
              items: {
                type: 'object',
                properties: {
                  index: {
                    type: 'void',
                    'x-component': 'ArrayTable.Index',
                    'x-component-props': { width: 60, title: '#' },
                  },
                  id: {
                    type: 'number',
                    title: "{{t('priceLevel.table.columns.product')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      filterable: true,
                      placeholder: "{{t('priceLevel.placeholder.product')}}",
                    },
                    enum: [],
                  },
                  remove: {
                    type: 'void',
                    title: "{{t('priceLevel.table.columns.ops')}}",
                    'x-component': 'ArrayTable.Remove',
                  },
                },
              },
              properties: {
                addition: {
                  type: 'void',
                  title: "{{t('priceLevel.form.add')}}",
                  'x-component': 'ArrayTable.Addition',
                },
              },
            },

            remark: {
              type: 'string',
              title: "{{t('priceLevel.form.remark')}}",
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {
                rows: 3,
                placeholder: "{{t('priceLevel.placeholder.remark')}}",
              },
            },
          },
        },

        rounding_off: {
          type: 'string',
          title: "{{t('priceLevel.form.roundingOff')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: "{{t('priceLevel.placeholder.roundingOff')}}",
          },
          enum: [
            { label: "{{t('priceLevel.enum.rounding.high')}}", value: 'HIGH' },
            {
              label: "{{t('priceLevel.enum.rounding.middle')}}",
              value: 'MIDDLE',
            },
            { label: "{{t('priceLevel.enum.rounding.low')}}", value: 'LOW' },
          ],
          'x-reactions': {
            dependencies: ['change_mode'],
            fulfill: { state: { visible: "{{$deps[0]==='PERCENTAGE'}}" } },
          },
        },

        rounding_amount: {
          type: 'number',
          title: "{{t('priceLevel.form.roundingAmount')}}",
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: "{{t('priceLevel.placeholder.roundingAmount')}}",
          },
          enum: [0.001, 0.01, 0.1, 1, 10, 100, 1000].map((v) => ({
            label: String(v),
            value: v,
          })),
          'x-reactions': {
            dependencies: ['change_mode'],
            fulfill: { state: { visible: "{{$deps[0]==='PERCENTAGE'}}" } },
          },
        },

        merchant_id: { type: 'number', 'x-visible': false },
        entity: { type: 'string', 'x-visible': false },
        creator_id: { type: 'number', default: 0, 'x-visible': false },
      },
    },
  },
} as ISchema;
