<template>
  <Page auto-content-height>
    <Form></Form>
    <div class="mt-4 text-center">
      <ElButton type="danger" plain @click="handleReset">重置</ElButton>
      <ElButton type="primary" @click="handleSave">保存</ElButton>
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
} from '@igourd/common-ui';
import {
  getCustomerEquityDetailApi,
  saveCustomerEquityApi,
} from '@@/customer/apis';
// vip 等级数据
const vipList = ref([]);

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
                header: '基本信息',
              },
              properties: {
                default_vip_level: {
                  type: 'number',
                  title: '默认VIP等级',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    // addonAfter: '',
                  },
                  'x-component-props': {
                    placeholder: '请输入默认VIP等级',
                    clearable: true,
                  },
                },
                maximum_vip_level: {
                  type: 'number',
                  title: '最大会员等级',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    // addonAfter: '',
                  },
                  'x-component-props': {
                    placeholder: '请输入最大会员等级（1-10）',
                    clearable: true,
                  },
                },

                vip_code_type: {
                  type: 'string',
                  title: 'VIP编码',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-decorator-props': {
                    // addonAfter: '',
                  },
                  enum: [
                    {
                      label: '时间戳生产',
                      value: 'TIMESTAMP',
                    },
                  ],
                  'x-component-props': {
                    placeholder: '请选择',
                    clearable: true,
                  },
                },
                setting_merchant_customer_rights_level_list: {
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-decorator': 'FormItem',
                  title: 'VIP等级名称',
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
                        'x-component-props': { width: 200, title: 'VIP等级' },
                        properties: {
                          vip_level: {
                            type: 'string',
                            'x-component': 'RemoteSelect',
                            'x-component-props': {
                              remoteMethod,
                            },
                          },
                        },
                      },
                      column3: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { width: 200, title: 'VIP名称' },
                        properties: {
                          vip_level_name: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      column5: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: '操作',
                          prop: 'operations',
                          width: 200,
                          fixed: 'right',
                        },
                        properties: {
                          item: {
                            type: 'void',
                            'x-component': 'FormItem',
                            properties: {
                              remove: {
                                type: 'void',
                                'x-component': 'ArrayTable.Remove',
                                title: '删除',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  properties: {
                    add: {
                      type: 'void',
                      'x-component': 'ArrayTable.Addition',
                      title: '添加',
                    },
                  },
                },
              },
            },
            card_1: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: '升级模式设置',
              },
              properties: {
                rights_type: {
                  type: 'boolean',
                  title: '会员升级模式',
                  enum: [
                    {
                      label: '现金',
                      value: 'CASH',
                    },
                    {
                      label: '折扣',
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
                  title: '充值金额',
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
                        'x-component-props': { width: 200, title: 'VIP等级' },
                        properties: {
                          vip_level: {
                            type: 'string',
                            'x-component': 'RemoteSelect',
                            'x-component-props': {
                              remoteMethod,
                            },
                          },
                        },
                      },
                      total_order_amount_column: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { width: 200, title: '金额' },
                        'x-reactions': {
                          dependencies: ['rights_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='DISCOUNT'}}" },
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
                        'x-component-props': { width: 200, title: '金额' },
                        'x-reactions': {
                          dependencies: ['rights_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='CASH'}}" },
                          },
                        },
                        properties: {
                          recharge_amount: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      column5: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: '操作',
                          prop: 'operations',
                          width: 200,
                          fixed: 'right',
                        },
                        properties: {
                          item: {
                            type: 'void',
                            'x-component': 'FormItem',
                            properties: {
                              remove: {
                                type: 'void',
                                'x-component': 'ArrayTable.Remove',
                                title: '删除',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  properties: {
                    add: {
                      type: 'void',
                      'x-component': 'ArrayTable.Addition',
                      title: '添加',
                    },
                  },
                },
              },
            },
            card_2: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: '优惠模式设置',
              },
              properties: {
                upgrade_type: {
                  type: 'boolean',
                  title: '优惠模式',
                  enum: [
                    {
                      label: '充值',
                      value: 'RECHARGE',
                    },
                    {
                      label: '累计消费',
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
                  title: '兑换方式设置',
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
                        'x-component-props': { width: 200, title: 'VIP等级' },
                        properties: {
                          vip_level: {
                            type: 'string',
                            'x-component': 'RemoteSelect',
                            'x-component-props': {
                              remoteMethod,
                            },
                          },
                        },
                      },
                      column3: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { width: 200, title: '金额' },
                        'x-reactions': {
                          dependencies: ['upgrade_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='RECHARGE'}}" },
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
                        'x-component-props': { width: 200, title: '优惠比例' },
                        'x-reactions': {
                          dependencies: ['upgrade_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='CONSUMPTION'}}" },
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
                        'x-component-props': { width: 200, title: '取整类型' },
                        'x-reactions': {
                          dependencies: ['upgrade_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='CONSUMPTION'}}" },
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
                        'x-component-props': { width: 200, title: '舍入量' },
                        'x-reactions': {
                          dependencies: ['upgrade_type'],
                          fulfill: {
                            state: { visible: "{{$deps[0]==='CONSUMPTION'}}" },
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
                      column5: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: '操作',
                          prop: 'operations',
                          width: 200,
                          fixed: 'right',
                        },
                        properties: {
                          item: {
                            type: 'void',
                            'x-component': 'FormItem',
                            properties: {
                              remove: {
                                type: 'void',
                                'x-component': 'ArrayTable.Remove',
                                title: '删除',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  properties: {
                    add: {
                      type: 'void',
                      'x-component': 'ArrayTable.Addition',
                      title: '添加',
                    },
                  },
                },
              },
            },
            card_3: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: '其他设置',
              },
              properties: {
                is_points_multiple: {
                  type: 'boolean',
                  title: '积分倍数',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                  'x-decorator-props': {
                    asterisk: false, // label 上显示必填的 * 号
                    feedbackLayout: 'none',
                  },
                },
                setting_level_list_rights_type: {
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-decorator': 'FormItem',
                  title: '积分倍数',
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
                        'x-component-props': { width: 200, title: 'VIP等级' },
                        properties: {
                          vip_level: {
                            type: 'string',
                            'x-component': 'RemoteSelect',
                            'x-component-props': {
                              remoteMethod,
                            },
                          },
                        },
                      },
                      total_order_amount_column: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { width: 200, title: '积分' },
                        properties: {
                          total_order_amount: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      column5: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: '操作',
                          prop: 'operations',
                          width: 200,
                          fixed: 'right',
                        },
                        properties: {
                          item: {
                            type: 'void',
                            'x-component': 'FormItem',
                            properties: {
                              remove: {
                                type: 'void',
                                'x-component': 'ArrayTable.Remove',
                                title: '删除',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  properties: {
                    add: {
                      type: 'void',
                      'x-component': 'ArrayTable.Addition',
                      title: '添加',
                    },
                  },
                },
                is_setting_validity_period: {
                  type: 'boolean',
                  title: '享受优惠有效期',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                  'x-decorator-props': {
                    asterisk: false, // label 上显示必填的 * 号
                    feedbackLayout: 'none',
                  },
                },

                is_setting_validity_period2: {
                  type: 'boolean',
                  title: '享受优惠有效日期',
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
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
function remoteMethod() {
  return new Promise((resolve, reject) => {
    resolve(vipList.value);
  });
}
const { Form, formAPI } = useIgourdForm({
  useI18n,
  schema: formSchema,
  readPretty: false,
  initialValues: {
    id: 0,
    setting_merchant_customer_rights_level_list: [],
    rights_type: 'CASH',
    upgrade_type: 'RECHARGE',
    is_points_multiple: false,
    is_setting_validity_period: false,
  },
  effects() {
    // 动态设置等级数据
    onFieldValueChange('maximum_vip_level', (field, form: Form) => {
      vipList.value = [];
      for (let i = 1; i <= field.value; i++) {
        vipList.value.push({
          value: i,
          label: i,
        });
      }
    });
    // 会员升级模式设置录入数据项目
    onFieldValueChange('rights_type', (field, form: Form) => {
      console.log(field.value);
    });
    // 优惠模式设置 设置录入数据项目
    onFieldValueChange('upgrade_type', (field, form: Form) => {
      console.log(field.value);
    });
  },
  scope: {},
});

const handleReset = () => {
  formAPI.reset();
  ElMessage.success('重置成功');
};
const handleSave = async () => {
  await formAPI.validate();
  //合并

  saveCustomerEquityApi(formAPI.values).then((res) => {
    ElMessage.success('保存成功');
  });
};
const getData = () => {
  getCustomerEquityDetailApi().then((res) => {
    // hideField(res.point_exchange_type, formAPI);
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
