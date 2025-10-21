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
            header: "{{t('discount.form.basic-info')}}",
            class: 'mb-1',
          },
          properties: {
            name: {
              type: 'string',
              title: "{{t('price-level.form.name')}}",
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                maxLength: 64,
                placeholder: "{{t('price-level.placeholder.name')}}",
              },
              'x-validator': [
                {
                  required: true,
                  message: "{{t('price-level.validate.name.required')}}",
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
                  title: "{{t('price-level.form.change-type')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: "{{t('price-level.placeholder.change-type')}}",
                    style: { width: '175px' },
                  },
                  enum: [
                    {
                      label: "{{t('price-level.enum.change-type.decrease')}}",
                      value: 'DECREASE',
                    },
                    {
                      label: "{{t('price-level.enum.change-type.increase')}}",
                      value: 'INCREASE',
                    },
                  ],
                  'x-validator': [
                    {
                      required: true,
                      message:
                        "{{t('price-level.validate.change-type.required')}}",
                    },
                  ],
                },
                change_mode: {
                  type: 'string',
                  // title: "{{t('price-level.form.change-mode')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: "{{t('price-level.placeholder.change-mode')}}",
                    style: { width: '175px' },
                  },
                  enum: [
                    {
                      label: "{{t('price-level.enum.change-mode.amount')}}",
                      value: 'AMOUNT',
                    },
                    {
                      label: "{{t('price-level.enum.change-mode.percentage')}}",
                      value: 'PERCENTAGE',
                    },
                  ],
                  'x-validator': [
                    {
                      required: true,
                      message:
                        "{{t('price-level.validate.change-mode.required')}}",
                    },
                  ],
                },

                change_value: {
                  type: 'number',
                  // title: "{{t('price-level.form.change-value')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    min: 0,
                    placeholder: "{{t('price-level.placeholder.change-value')}}",
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
                        "{{t('price-level.validate.change-value.required')}}",
                    },
                  ],
                },
              },
            },
            status: {
              type: 'string',
              title: "{{t('price-level.form.status')}}",
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
            header: "{{t('discount.form.active-setting')}}",
            class: 'mb-1',
          },
          properties: {
            effective_time: {
              type: 'string',
              title: "{{t('price-level.form.effective-time')}}",
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'date',
                valueFormat: 'YYYY-MM-DD 00:00:00',
                placeholder: "{{t('price-level.placeholder.effective-time')}}",
              },
              'x-validator': [
                {
                  required: true,
                  message:
                    "{{t('price-level.validate.effective-time.required')}}",
                },
              ],
            },

            expiration_time: {
              type: 'string',
              title: "{{t('price-level.form.expiration-time')}}",
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'date',
                valueFormat: 'YYYY-MM-DD 23:59:59',
                placeholder: "{{t('price-level.placeholder.expiration-time')}}",
              },
              'x-validator': [
                {
                  required: true,
                  message:
                    "{{t('price-level.validate.expiration-time.required')}}",
                },
                // {
                //   validator:
                //     "{{$self.value && $form.values.effective_time && new Date($self.value) < new Date($form.values.effective_time) ? t('price-level.validate.expiration-time.gte-effective') : ''}}",
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
              title: "{{t('price-level.form.relation-type')}}",
              default: 'ALL',
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              enum: [
                {
                  label: "{{t('price-level.enum.relation.all')}}",
                  value: 'ALL',
                },
                {
                  label: "{{t('price-level.enum.relation.group')}}",
                  value: 'PRODUCT_GROUP',
                },
                {
                  label: "{{t('price-level.enum.relation.label')}}",
                  value: 'PRODUCT_LABEL',
                },
                {
                  label: "{{t('price-level.enum.relation.product')}}",
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
              title: "{{t('price-level.form.remark')}}",
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {
                rows: 3,
                placeholder: "{{t('price-level.placeholder.remark')}}",
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
