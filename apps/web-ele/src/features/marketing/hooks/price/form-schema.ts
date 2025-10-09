import type { ISchema } from '@igourd/common-ui';

import { productGroupSelect } from '#/components/product-group';
import { productLabelSelect } from '#/components/product-label';
import { productSelect } from '#/components/product-select';

export default {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelWidth: 100,
      },
      properties: {
        card_0: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            header: "{{t('discount.form.basicInfo')}}",
            class: 'mb-1',
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
                  // title: "{{t('priceLevel.form.changeMode')}}",
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
                  // title: "{{t('priceLevel.form.changeValue')}}",
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
            header: "{{t('discount.form.activeSetting')}}",
            class: 'mb-1',
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
            header: "{{t('discount.form.products')}}",
            class: 'mb-1',
          },
          properties: {
            relation_type: {
              type: 'string',
              title: "{{t('priceLevel.form.relationType')}}",
              default: 'ALL',
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
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
            relation_product_group_list: {
              ...productGroupSelect,
              'x-decorator-props': {
                class: 'ml-[100px]',
              },
              'x-reactions': [
                {
                  dependencies: ['relation_type'],
                  fulfill: {
                    state: {
                      display:
                        "{{$deps[0]==='PRODUCT_GROUP' ? 'visible' : 'none'}}",
                    },
                  },
                },
              ],
            },

            relation_product_label_list: {
              ...productLabelSelect,
              'x-decorator-props': {
                class: 'ml-[100px]',
              },
              'x-reactions': [
                {
                  dependencies: ['relation_type'],
                  fulfill: {
                    state: {
                      display:
                        "{{$deps[0]==='PRODUCT_LABEL' ? 'visible' : 'none'}}",
                    },
                  },
                },
              ],
            },

            relation_product_list: {
              ...productSelect,
              'x-decorator-props': {
                class: 'ml-[100px]',
              },
              'x-reactions': [
                {
                  dependencies: ['relation_type'],
                  fulfill: {
                    state: {
                      display: "{{$deps[0]==='PRODUCT' ? 'visible' : 'none'}}",
                    },
                  },
                },
              ],
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
        entity: { type: 'string', 'x-visible': false },
        creator_id: { type: 'number', default: 0, 'x-visible': false },
      },
    },
  },
} as ISchema;
