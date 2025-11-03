import type { ISchema } from '@igourd/common-ui';

// form-schema.ts（不使用 FormGrid，仅 FormLayout）
import { productGroupSelect } from '#/components/product-group';
import { productLabelSelect } from '#/components/product-label';
import { productSelect } from '#/components/product-select';

export function useDiscountSchema(toggleShowMore: () => void) {
  const schema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelWidth: 100,
        },
        properties: {
          cycle_type: {
            type: 'string',
            'x-hidden': true,
          },
          card_0: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              header: '{{t("discount.form.basic-info")}}',
            },
            properties: {
              // added status form element
              status: {
                type: 'string',
                title: "{{t('discount.form.status')}}",
                default: 1,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                'x-component': 'Switch',
                'x-component-props': {
                  'active-value': 'active',
                  'inactive-value': 'inactive',
                },
              },

              type: {
                type: 'string',
                title: "{{t('discount.form.type')}}",
                default: 'DISCOUNT',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                'x-component': 'Radio.Group',
                enum: [
                  {
                    label: "{{t('discount.enum.type.discount')}}",
                    value: 'DISCOUNT',
                  },
                  {
                    label: "{{t('discount.enum.type.reduction')}}",
                    value: 'REDUCTION',
                  },
                ],
                required: true,
              },
              channel: {
                type: 'string',
                title: "{{t('discount.form.channel')}}",
                default: 'ONLINE_SHOP',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                enum: [
                  {
                    label: "{{t('discount.enum.channel.store')}}",
                    value: 'STORE',
                  },
                  {
                    label: "{{t('discount.enum.channel.online')}}",
                    value: 'ONLINE_SHOP',
                    disabled: true,
                  },
                ],
                required: true,
              },

              name: {
                type: 'string',
                title: "{{t('discount.form.name')}}",
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 40,
                  placeholder: "{{t('discount.placeholder.name')}}",
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('discount.validate.name.required')}}",
                  },
                  {
                    format: 'regex',
                    pattern: '^[^`~!@#$^&*()=+\\[\\]{};:\'\\",<>/?\\\\|]+$',
                    message: "{{t('discount.validate.name.no-special')}}",
                  },
                ],
              },

              apply_vip: {
                type: 'number',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                title: "{{t('discount.form.apply-vip')}}",
                default: 1,
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
                'x-component-props': {
                  'active-value': 1,
                  'inactive-value': 0,
                },
              },

              // —— 满减 —— //
              minimum_amount: {
                type: 'number',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                title: "{{t('discount.form.minimum-amount')}}",
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                  min: 0,
                  placeholder: "{{t('discount.placeholder.minimum-amount')}}",
                },
                'x-reactions': {
                  dependencies: ['type'],
                  fulfill: { state: { visible: "{{$deps[0]==='REDUCTION'}}" } },
                },
                'x-validator': [
                  {
                    required: true,
                    message:
                      "{{t('discount.validate.minimum-amount.required')}}",
                    triggerType: 'onBlur',
                  },
                  {
                    minimum: 0,
                    message: "{{t('discount.validate.number.non-negative')}}",
                  },
                ],
              },

              reduce_amount: {
                type: 'number',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                title: "{{t('discount.form.reduce-amount')}}",
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                  min: 0,
                  placeholder: "{{t('discount.placeholder.reduce-amount')}}",
                },
                'x-reactions': {
                  dependencies: ['type'],
                  fulfill: { state: { visible: "{{$deps[0]==='REDUCTION'}}" } },
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('discount.validate.reduce-amount.required')}}",
                    triggerType: 'onBlur',
                  },
                  {
                    minimum: 0,
                    message: "{{t('discount.validate.number.non-negative')}}",
                  },
                ],
              },
              // —— 折扣 —— //
              discount_percentage: {
                type: 'number',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                title: "{{t('discount.form.discount-percentage')}}",
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                  min: 0,
                  max: 100,
                  step: 0.1,
                  placeholder:
                    "{{t('discount.placeholder.discount-percentage')}}",
                },
                'x-reactions': {
                  dependencies: ['type'],
                  fulfill: { state: { visible: "{{$deps[0]==='DISCOUNT'}}" } },
                },
                'x-validator': [
                  {
                    required: true,
                    message:
                      "{{t('discount.validate.discount-percentage.required')}}",
                    triggerType: 'onBlur',
                  },
                  {
                    maximum: 100,
                    message:
                      "{{t('discount.validate.discount-percentage.max')}}",
                  },
                  {
                    minimum: 0,
                    message: "{{t('discount.validate.number.non-negative')}}",
                  },
                ],
              },

              rounding_off: {
                type: 'string',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                title: "{{t('discount.form.rounding-off')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('discount.placeholder.rounding-off')}}",
                },
                enum: [
                  {
                    label: "{{t('discount.enum.rounding.high')}}",
                    value: 'HIGH',
                  },
                  {
                    label: "{{t('discount.enum.rounding.middle')}}",
                    value: 'MIDDLE',
                  },
                  {
                    label: "{{t('discount.enum.rounding.low')}}",
                    value: 'LOW',
                  },
                ],
                'x-reactions': {
                  dependencies: ['type'],
                  fulfill: { state: { visible: "{{$deps[0]==='DISCOUNT'}}" } },
                },
                'x-validator': [
                  {
                    required: true,
                    message: "{{t('discount.validate.rounding-off.required')}}",
                  },
                ],
              },

              rounding_amount: {
                type: 'number',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                title: "{{t('discount.form.rounding-amount')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: "{{t('discount.placeholder.rounding-amount')}}",
                },
                enum: [
                  { label: '0.001', value: 0.001 },
                  { label: '0.01', value: 0.01 },
                  { label: '0.1', value: 0.1 },
                  { label: '1', value: 1 },
                  { label: '10', value: 10 },
                  { label: '100', value: 100 },
                  { label: '1000', value: 1000 },
                ],
                'x-reactions': {
                  dependencies: ['type'],
                  fulfill: { state: { visible: "{{$deps[0]==='DISCOUNT'}}" } },
                },
                'x-validator': [
                  {
                    required: true,
                    message:
                      "{{t('discount.validate.rounding-amount.required')}}",
                  },
                ],
              },
            },
          },
          card_1: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              header: '{{t("discount.form.active-setting")}}',
            },
            properties: {
              effective_time: {
                type: 'string',
                title: "{{t('discount.form.effective-time')}}",
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                'x-component-props': {
                  type: 'date',
                  valueFormat: 'YYYY-MM-DD 00:00:00',
                  placeholder: "{{t('discount.placeholder.effective-time')}}",
                },
                'x-validator': [
                  {
                    required: true,
                    message:
                      "{{t('discount.validate.effective-time.required')}}",
                  },
                ],
              },

              expiration_time: {
                type: 'string',
                title: "{{t('discount.form.expiration-time')}}",
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker',
                'x-decorator-props': {
                  wrapperWidth: 300,
                },
                'x-component-props': {
                  type: 'date',
                  valueFormat: 'YYYY-MM-DD 23:59:59',
                  placeholder: "{{t('discount.placeholder.expiration-time')}}",
                },
                'x-validator': [
                  {
                    required: true,
                    message:
                      "{{t('discount.validate.expiration-time.required')}}",
                  },
                  // {
                  //   validator:
                  //     "{{$self.value && $form.values.effective_time && new Date($self.value) < new Date($form.values.effective_time) ? t('discount.validate.expiration-time.gte-effective') : ''}}",
                  // },
                ],
              },
              schedule_panel: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  class: 'ml-[100px]',
                },
                properties: {
                  div_1: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      class:
                        ' flex justify-center text-base items-center text-primary cursor-pointer select-none',
                      '@click': toggleShowMore,
                    },
                    'x-content': {
                      default: '{{ t("discount.more-time-setting") }}',
                    },
                  },
                  tab1: {
                    type: 'void',
                    'x-component': 'Card',
                    properties: {
                      // —— 有效时段 / 星期 / 日期 —— //
                      active_day_hours: {
                        type: 'array',
                        'x-decorator': 'FormItem',
                        'x-component': 'PeriodPick',
                        'x-component-props': {
                          headerRight: 'text',
                          label: "{{t('discount.form.active-hours')}}",
                          resetOnModeChange: true,
                        },
                      },
                      active_week_days: {
                        type: 'array',
                        'x-decorator': 'FormItem',
                        'x-component': 'PeriodPick',
                        'x-component-props': {
                          mode: 'WEEKLY',
                          headerRight: 'mode-select',
                          label: "{{t('discount.form.period')}}",
                          resetOnModeChange: true,
                          '@modeChange':
                            '{{ (m) => $form.setValuesIn("cycle_type", m) }}',
                        },
                        'x-reactions': {
                          dependencies: ['cycle_type'],
                          fulfill: {
                            state: {
                              hidden: "{{ $deps[0] !== 'WEEKLY'}}",
                            },
                          },
                        },
                      },
                      active_month_days: {
                        type: 'array',
                        'x-decorator': 'FormItem',
                        'x-component': 'PeriodPick',
                        'x-component-props': {
                          mode: 'MONTHLY',
                          headerRight: 'mode-select',
                          label: "{{t('discount.form.period')}}",
                          resetOnModeChange: true,
                          '@modeChange':
                            '{{ (m) => $form.setValuesIn("cycle_type", m) }}',
                        },
                        'x-reactions': {
                          dependencies: ['cycle_type'],
                          fulfill: {
                            state: {
                              hidden: "{{$deps[0] !== 'MONTHLY'}}",
                            },
                          },
                        },
                      },
                      active_day_pick: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'PeriodPick',
                        'x-component-props': {
                          mode: 'DAILY',
                          headerRight: 'mode-select',
                          hiddenPicker: true,
                          '@modeChange':
                            '{{ (m) => $form.setValuesIn("cycle_type", m) }}',
                          label: "{{t('discount.form.period')}}",
                          resetOnModeChange: true,
                        },
                        'x-reactions': {
                          dependencies: ['cycle_type'],
                          fulfill: {
                            state: {
                              hidden: "{{ $deps[0] && $deps[0] !== 'DAILY'}}",
                            },
                          },
                        },
                      },
                      exclude_dates: {
                        type: 'array',
                        title: "{{t('discount.form.exclude-dates')}}",
                        default: [], // ✅ 必须是数组
                        'x-decorator': 'FormItem',
                        'x-component': 'DatePicker',
                        'x-component-props': {
                          type: 'dates', // ✅ 多选单日
                          valueFormat: 'YYYY-MM-DD', // 提交为 'YYYY-MM-DD' 字符串数组
                          clearable: true,
                          // placeholder: "{{t('discount.placeholder.excludeDates')}}", // 如你词典里有就放开
                        },
                      },
                    },
                    'x-reactions': {
                      fulfill: {
                        state: {
                          hidden: '{{ !showMore.value }}',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          card_2: {
            type: 'void',
            'x-component': 'Card',
            'x-component-props': {
              header: '{{t("discount.form.products")}}',
            },
            properties: {
              relation_type: {
                type: 'string',
                title: "{{t('discount.form.relation-type')}}",
                default: 'ALL',
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                enum: [
                  {
                    label: "{{t('discount.enum.relation.all')}}",
                    value: 'ALL',
                  },
                  {
                    label: "{{t('discount.enum.relation.group')}}",
                    value: 'PRODUCT_GROUP',
                  },
                  {
                    label: "{{t('discount.enum.relation.label')}}",
                    value: 'PRODUCT_LABEL',
                  },
                  {
                    label: "{{t('discount.enum.relation.product')}}",
                    value: 'PRODUCT',
                  },
                ],
              },
              relation_product_group_id_list: {
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

              relation_product_label_id_list: {
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

              relation_product_id_list: {
                ...productSelect,
                'x-decorator-props': {
                  class: 'ml-[100px]',
                },
                'x-reactions': [
                  {
                    dependencies: ['relation_type'],
                    fulfill: {
                      state: {
                        display:
                          "{{$deps[0]==='PRODUCT' ? 'visible' : 'none'}}",
                      },
                    },
                  },
                ],
              },
              remark: {
                type: 'string',
                title: "{{t('discount.form.remark')}}",
                'x-decorator': 'FormItem',
                'x-component': 'Input.TextArea',
                'x-component-props': { rows: 3 },
              },
            },
          },
          // —— 关联范围选择 —— //
          // 隐藏字段
          merchant_id: { type: 'number', 'x-visible': false },
          creator_id: { type: 'number', default: 0, 'x-visible': false },
        },
      },
    },
  };
  return schema;
}
