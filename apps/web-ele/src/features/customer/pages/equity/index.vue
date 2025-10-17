<template>
  <Page auto-content-height>
    <Form></Form>
    <div class="mt-4 text-center">
      <ElButton type="danger" plain @click="handleReset">{{
        t('common.reset')
      }}</ElButton>
      <ElButton type="primary" @click="handleSave">{{
        t('common.save')
      }}</ElButton>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ISchema } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
const { t } = useI18n();
import { useIgourdForm } from '@igourd/common-ui';
import {
  Page,
  ElButton,
  ElMessage,
  onFieldValueChange,
  observable,
} from '@igourd/common-ui';
import {
  getCustomerEquityDetailApi,
  saveCustomerEquityApi,
} from '@@/customer/apis';
interface ListItem {
  value: any;
  label: string;
}
// vip 等级数据
const vipList = observable<{ value: ListItem[] }>({ value: [] });
// 取整类型
const roundingOffList = [
  {
    value: 'HIGH',
    label: t('equity.rounding-off.round-high'),
  },
  {
    value: 'MIDDLE',
    label: t('equity.rounding-off.round-middle'),
  },
  {
    value: 'LOW',
    label: t('equity.rounding-off.round-low'),
  },
];
const roundingAmountList = [
  {
    value: 1,
    label: 1,
  },
  {
    value: 10,
    label: 10,
  },
  {
    value: 100,
    label: 100,
  },
  {
    value: 1009,
    label: 1000,
  },
];
const validityPeriods = [
  { label: '6 months', value: 6 },
  { label: '1 year', value: 12 },
  { label: '2 years', value: 24 },
  { label: '3 years', value: 36 },
  { label: '5 years', value: 60 },
];
const validatorDefaultVIP = (val, msg) => {
  const max = formAPI.values.maximum_vip_level;
  if (max && val > max) {
    return t('equity.defaultviplevel-validator-msg');
  } else {
    return true;
  }
};
const formSchema: ISchema = {
  type: 'object',
  properties: {
    form: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 14,
      },
      properties: {
        card_0: {
          type: 'void',
          'x-component': 'Card',
          'x-component-props': {
            // header: '{{t("discount.form.basicInfo")}}',
          },
          properties: {
            card_0: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: "{{t('common.basic-information')}}",
              },
              properties: {
                default_vip_level: {
                  type: 'number',
                  title: "{{t('customer.defaultVIPlevel')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    // addonAfter: '',
                  },
                  'x-component-props': {
                    placeholder:
                      "{{t('equity.default-vip-level-placeholder')}}",
                    clearable: true,
                  },
                  'x-validator': [
                    {
                      required: true,
                      message: "{{t('equity.please-enter-defaultviplevel')}}",
                      triggerType: 'onBlur',
                    },
                    {
                      validator: validatorDefaultVIP,
                      triggerType: 'onBlur',
                    },
                  ],
                },
                maximum_vip_level: {
                  type: 'number',
                  title: "{{t('customer.maximummembershiplevel')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    // addonAfter: '',
                  },
                  'x-component-props': {
                    placeholder:
                      "{{t('equity.max-mummember-level-placeholder')}}",
                    clearable: true,
                  },
                  'x-validator': [
                    {
                      required: true,
                      message: "{{t('equity.please-enter-maximummembershiplevel')}}",
                      triggerType: 'onBlur',
                    }
                  ],
                },

                vip_code_type: {
                  type: 'string',
                  title: "{{t('customer.vipcode')}}",
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-decorator-props': {
                    // addonAfter: '',
                  },
                  enum: [
                    {
                      label: t('equity.timestamp'),
                      value: 'TIMESTAMP',
                    },
                  ],
                  'x-component-props': {
                    placeholder: "{{t('common.form.select_required')}}",
                    clearable: true,
                  },
                },
                setting_merchant_customer_rights_level_list: {
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-decorator': 'FormItem',
                  title: "{{t('customer.viplevelname')}}",
                  items: {
                    type: 'object',
                    properties: {
                      column1: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 80,
                          title: ' ',
                          align: 'center',
                        },
                        properties: {
                          index: {
                            type: 'void',
                            'x-component': 'ArrayTable.Index',
                          },
                        },
                      },
                      column2: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title:
                            "{{t('customer.customerListTable.vip_level')}}",
                        },
                        properties: {
                          vip_level: {
                            type: 'string',
                            'x-component': 'Select',
                            'x-reactions': {
                              fulfill: {
                                state: {
                                  dataSource: '{{ vipList.value }}',
                                },
                              },
                            },
                            'x-component-props': {},
                          },
                        },
                      },
                      column3: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title: "{{t('equity.vip-name')}}",
                        },
                        properties: {
                          vip_level_name: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      col_actions: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: "{{t('common.operation')}}",
                          width: 100,
                          fixed: 'right',
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            title: "{{t('common.addBtn')}}",
                            'x-component': 'ArrayTable.Addition',
                            'x-reactions': {
                              dependencies: [
                                'setting_merchant_customer_rights_level_list',
                                'maximum_vip_level',
                              ],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled:
                                      '{{ !$deps[1] || $deps[0]?.length >= $deps[1]}}',
                                  },
                                },
                              },
                            },
                          },
                          remove: {
                            type: 'void',
                            'x-component': 'ArrayTable.Remove',
                            title: "{{ t('common.delete') }}",
                            'x-reactions': {
                              dependencies: [
                                'setting_merchant_customer_rights_level_list',
                              ],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled: '{{ $deps[0]?.length ==1 }}',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            // 升级模式设置
             card_2: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: "{{t('customer.upgradeModeSetting')}}",
              },
              properties: {
                upgrade_type: {
                  type: 'boolean',
                  title: "{{t('customer.memberupgrademode')}}",
                  enum: [
                    {
                      label: t('customer.topup'),
                      value: 'RECHARGE',
                    },
                    {
                      label: t('customer.cumulativeconsumption'),
                      value: 'CONSUMPTION',
                    },
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  'x-component-props': {},
                },
                setting_level_list_upgrade_type: {
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-decorator': 'FormItem',
                  title: "{{t('customer.rechargeamount')}}",
                  items: {
                    type: 'object',
                    properties: {
                      column1: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 80,
                          title: ' ',
                          align: 'center',
                        },
                        properties: {
                          index: {
                            type: 'void',
                            'x-component': 'ArrayTable.Index',
                          },
                        },
                      },
                      column2: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title:
                            "{{t('customer.customerListTable.vip_level')}}",
                        },
                        properties: {
                          vip_level: {
                            type: 'string',
                            'x-component': 'Select',
                            'x-reactions': {
                              fulfill: {
                                state: {
                                  dataSource: '{{ vipList.value }}',
                                },
                              },
                            },
                            'x-component-props': {},
                          },
                        },
                      },
                      total_order_amount_column: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title: "{{t('common.amount')}}",
                        },
                        'x-reactions': {
                          dependencies: ['upgrade_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='CONSUMPTION'}}" },
                          },
                        },
                        properties: {
                          total_order_amount: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      recharge_amount_column: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title: "{{t('common.amount')}}",
                        },
                        'x-reactions': {
                          dependencies: ['upgrade_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='RECHARGE'}}" },
                          },
                        },
                        properties: {
                          recharge_amount: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      col_actions: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: "{{t('common.operation')}}",
                          width: 100,
                          fixed: 'right',
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            title: "{{t('common.addBtn')}}",
                            'x-component': 'ArrayTable.Addition',
                            'x-reactions': {
                              dependencies: [
                                'setting_level_list_upgrade_type',
                                'maximum_vip_level',
                              ],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled:
                                      '{{ !$deps[1] || $deps[0]?.length >= $deps[1]}}',
                                  },
                                },
                              },
                            },
                          },
                          remove: {
                            type: 'void',
                            'x-component': 'ArrayTable.Remove',
                            title: "{{ t('common.delete') }}",
                            'x-reactions': {
                              dependencies: ['setting_level_list_upgrade_type'],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled: '{{ $deps[0]?.length ==1 }}',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },

              },
            },
            //优惠模式设置
            card_1: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: "{{t('customer.preferentialModeSetting')}}",
              },
              properties: {
                rights_type: {
                  type: 'boolean',
                  title: "{{t('customer.preferentialmode')}}",
                  enum: [
                    {
                      label: t('customer.cash'),
                      value: 'CASH',
                    },
                    {
                      label: t('customer.discount'),
                      value: 'DISCOUNT',
                    },
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  'x-component-props': {},
                },
                setting_level_list_rights_type: {
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-decorator': 'FormItem',
                  title: "{{t('customer.exchangemode')}}",
                  items: {
                    type: 'object',
                    properties: {
                      column1: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 80,
                          title: ' ',
                          align: 'center',
                        },
                        properties: {
                          index: {
                            type: 'void',
                            'x-component': 'ArrayTable.Index',
                          },
                        },
                      },
                      column2: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title:
                            "{{t('customer.customerListTable.vip_level')}}",
                        },
                        properties: {
                          vip_level: {
                            type: 'string',
                            'x-component': 'Select',
                            'x-reactions': {
                              fulfill: {
                                state: {
                                  dataSource: '{{ vipList.value }}',
                                },
                              },
                            },
                            'x-component-props': {},
                          },
                        },
                      },
                      column3: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title: "{{t('common.amount')}}",
                        },
                        'x-reactions': {
                          dependencies: ['rights_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='CASH'}}" },
                          },
                        },
                        properties: {
                          gift_amount: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      discount_percentage_column: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title: "{{t('equity.discount-rate')}}",
                        },
                        'x-reactions': {
                          dependencies: ['rights_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='DISCOUNT'}}" },
                          },
                        },
                        properties: {
                          discount_percentage: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      rounding_off_column: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title: "{{t('equity.rounding-off.type')}}",
                        },
                        'x-reactions': {
                          dependencies: ['rights_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='DISCOUNT'}}" },
                          },
                        },
                        properties: {
                          rounding_off: {
                            type: 'string',
                            'x-component': 'Select',
                            enum: roundingOffList,
                          },
                        },
                      },
                      rounding_amount_column: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title: "{{t('equity.rounding-amount')}}",
                        },
                        'x-reactions': {
                          dependencies: ['rights_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='DISCOUNT'}}" },
                          },
                        },
                        properties: {
                          rounding_amount: {
                            type: 'string',
                            'x-component': 'Select',
                            enum: roundingAmountList,
                          },
                        },
                      },
                      col_actions: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: "{{t('common.operation')}}",
                          width: 100,
                          fixed: 'right',
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            title: "{{t('common.addBtn')}}",
                            'x-component': 'ArrayTable.Addition',
                            'x-reactions': {
                              dependencies: [
                                'setting_level_list_rights_type',
                                'maximum_vip_level',
                              ],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled:
                                      '{{ !$deps[1] || $deps[0]?.length >= $deps[1]}}',
                                  },
                                },
                              },
                            },
                          },
                          remove: {
                            type: 'void',
                            'x-component': 'ArrayTable.Remove',
                            title: "{{ t('common.delete') }}",
                            'x-reactions': {
                              dependencies: ['setting_level_list_rights_type'],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled: '{{ $deps[0]?.length ==1 }}',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            card_3: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: "{{t('customer.otherSettings')}}",
              },
              properties: {
                is_points_multiple: {
                  type: 'boolean',
                  title: "{{t('customer.integralmultiple')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                  'x-decorator-props': {
                    asterisk: false, // label 上显示必填的 * 号
                    feedbackLayout: 'none',
                  },
                },
                setting_level_list_points: {
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-decorator': 'FormItem',
                  title: "{{t('customer.integralmultiple')}}",
                  items: {
                    type: 'object',
                    properties: {
                      column1: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 80,
                          title: ' ',
                          align: 'center',
                        },
                        properties: {
                          index: {
                            type: 'void',
                            'x-component': 'ArrayTable.Index',
                          },
                        },
                      },
                      column2: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title:
                            "{{t('customer.customerListTable.vip_level')}}",
                        },
                        properties: {
                          vip_level: {
                            type: 'string',
                            'x-component': 'Select',
                            'x-reactions': {
                              fulfill: {
                                state: {
                                  dataSource: '{{ vipList.value }}',
                                },
                              },
                            },
                            'x-component-props': {},
                          },
                        },
                      },
                      total_order_amount_column: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 200,
                          title: "{{t('customer.customerListTable.points')}}",
                        },
                        properties: {
                          points_multiple: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      col_actions: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: "{{t('common.operation')}}",
                          width: 100,
                          fixed: 'right',
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            title: "{{t('common.addBtn')}}",
                            'x-component': 'ArrayTable.Addition',
                            'x-reactions': {
                              dependencies: [
                                'setting_level_list_points',
                                'maximum_vip_level',
                              ],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled:
                                      '{{ !$deps[1] || $deps[0]?.length >= $deps[1]}}',
                                  },
                                },
                              },
                            },
                          },
                          remove: {
                            type: 'void',
                            'x-component': 'ArrayTable.Remove',
                            title: "{{ t('common.delete') }}",
                            'x-reactions': {
                              dependencies: ['setting_level_list_points'],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled: '{{ $deps[0]?.length ==1 }}',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                is_setting_validity_period: {
                  type: 'boolean',
                  title: "{{t('customer.enjoytheoffervalidityperiod')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                  'x-decorator-props': {
                    asterisk: false, // label 上显示必填的 * 号
                    feedbackLayout: 'none',
                  },
                },

                validity_month: {
                  type: 'boolean',
                  title: "{{t('customer.enjoytheoffervaliddate')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  'x-reactions': {
                    dependencies: ['is_setting_validity_period'],
                    fulfill: {
                      state: { visible: '{{$deps[0]}}' },
                    },
                  },
                  'x-component-props': {
                    options: validityPeriods,
                    optionType: 'button',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const { Form, formAPI } = useIgourdForm({
  useI18n,
  schema: formSchema,
  readPretty: false,
  initialValues: {
    id: 0,
    setting_merchant_customer_rights_level_list: [{}],
    rights_type: 'CASH',
    upgrade_type: 'RECHARGE',
    is_points_multiple: false,
    is_setting_validity_period: false,
    //优惠模式设置
    setting_level_list_rights_type: [{}],
    //升级模式设置
    setting_level_list_upgrade_type: [{}],
    setting_level_list_points: [{}],
  },
  effects() {
    // 动态设置等级数据
    onFieldValueChange('maximum_vip_level', (field, form: Form) => {
      vipList.value = [];
      let value = field.value;
      if (value && !/[0-9]/.test(value)) {
        value = value.replace(/[^0-9]/g, '');
      }
      const max = value > 10 ? 10 : value;
      formAPI.setValuesIn('maximum_vip_level', max);
      console.log(max);
      for (let i = 1; i <= max; i++) {
        vipList.value.push({
          value: i,
          label: i,
        });
      }
    });
    onFieldValueChange('default_vip_level', (field, form: Form) => {
      let value = field.value;
      if (value && !/[0-9]/.test(value)) {
        value = value.replace(/[^0-9]/g, '');
      }
      formAPI.setValuesIn('default_vip_level', value);
    });
    // 会员升级模式设置录入数据项目
    onFieldValueChange('upgrade_type', (field, form: Form) => {
      console.log(field.value);
    });
    // 优惠模式设置 设置录入数据项目
    onFieldValueChange('rights_type', (field, form: Form) => {
      console.log(field.value);
    });
  },
  scope: {
    vipList,
    validatorDefaultVIP,
  },
});

const handleReset = () => {
  formAPI.reset();
  ElMessage.success(t('customer.resetSuccess'));
};
const handleSave = async () => {
  await formAPI.validate();
  const list = formAPI.values.setting_merchant_customer_rights_level_list.map(
    (element) => {
      debugger
      // 惠模式设置
      let hasItemRights = formAPI.values.setting_level_list_rights_type.find(
        (item) => item.vip_level == element.vip_level,
      );
      //会员升级模式
      let hasItemUp = formAPI.values.setting_level_list_upgrade_type.find(
        (item) => item.vip_level == element.vip_level,
      );
      let hasPoints = formAPI.values.setting_level_list_points.find(
        (item) => item.vip_level == element.vip_level,
      );
      return {
        ...element,
        ...hasItemRights,
        ...hasItemUp,
        ...hasPoints,
      };
    },
  );
  formAPI.values.setting_merchant_customer_rights_level_list = list;
  //合并
  saveCustomerEquityApi(formAPI.values).then((res) => {
    ElMessage.success(t('customer.saveSuccess'));
  });
};
const getData = () => {
  let setting_merchant_customer_rights_level_list = [];
  // 优惠模式设置
  let setting_level_list_rights_type:any = [];
  //升级模式设置
  let setting_level_list_upgrade_type:any = [];
  let setting_level_list_points:any = [];
  getCustomerEquityDetailApi().then((res) => {
    // hideField(res.point_exchange_type, formAPI);
    const list = res.setting_merchant_customer_rights_level_model_list.forEach(
      (element) => {
        setting_merchant_customer_rights_level_list.push({
          vip_level: element.vip_level,
          vip_level_name: element.vip_level_name,
        });
        setting_level_list_upgrade_type.push({
          vip_level: element.vip_level,
          total_order_amount: element.total_order_amount,
          recharge_amount: element.recharge_amount,
        });
        setting_level_list_rights_type.push({
          vip_level: element.vip_level,
          discount_percentage: element.discount_percentage,
          rounding_off: element.rounding_off,
          rounding_amount: element.rounding_amount,
          gift_amount: element.gift_amount,
        });
        // 双倍积分
        setting_level_list_points.push({
          vip_level: element.vip_level,
          // 积分倍数
          points_multiple: element.points_multiple,
        });
      },
    );
    res.setting_merchant_customer_rights_level_list = setting_merchant_customer_rights_level_list;
    res.setting_level_list_rights_type = setting_level_list_rights_type;
    res.setting_level_list_upgrade_type = setting_level_list_upgrade_type;
    res.setting_level_list_points = setting_level_list_points;
    formAPI.setValues(res);
  });
};
defineOptions({
  name: 'ICustomerIntegral',
});
onMounted(() => {
  getData();
});
</script>
