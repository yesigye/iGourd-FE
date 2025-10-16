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
                        'x-component-props': { width: 200, title: 'VIP名称' },
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
                          title: '操作',
                          width: 100,
                          fixed: 'right',
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            title: '添加',
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
                                      '{{ $deps[0]?.length == $deps[1]}}',
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
                      col_actions: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: '操作',
                          width: 100,
                          fixed: 'right',
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            title: '添加',
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
                                      '{{ $deps[0]?.length == $deps[1]}}',
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
                      col_actions: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: '操作',
                          width: 100,
                          fixed: 'right',
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            title: '添加',
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
                                      '{{ $deps[0]?.length == $deps[1]}}',
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
                setting_level_list_points: {
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
                        'x-component-props': { width: 200, title: '积分' },
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
                          title: '操作',
                          width: 100,
                          fixed: 'right',
                        },
                        properties: {
                          addition: {
                            type: 'void',
                            title: '添加',
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
                                      '{{ $deps[0]?.length == $deps[1]}}',
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
                  title: '享受优惠有效期',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                  'x-decorator-props': {
                    asterisk: false, // label 上显示必填的 * 号
                    feedbackLayout: 'none',
                  },
                },

                validity_month: {
                  type: 'boolean',
                  title: '享受优惠有效日期',
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
    setting_level_list_rights_type: [{}],
    setting_level_list_upgrade_type: [{}],
    setting_level_list_points: [{}],
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
  scope: {
    vipList,
  },
});

const handleReset = () => {
  formAPI.reset();
  ElMessage.success('重置成功');
};
const handleSave = async () => {
  await formAPI.validate();
  const list = formAPI.values.setting_merchant_customer_rights_level_list.map(
    (element) => {
      //会员升级模式
      let hasItemRights = formAPI.values.setting_level_list_rights_type.find(
        (item) => item.vip_level == element.vip_level,
      );
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
    ElMessage.success('保存成功');
  });
};
/**
 * 后台数据转换为表单数据的回显函数
 * @param {Array} backendData - 后台返回的数据数组
 * @param {Object} formStructure - 表单结构对象
 * @returns {Object} - 转换后的表单数据
 */
const convertBackendDataToForm = (backendData, formStructure) => {
  // 创建结果对象，基于原有表单结构
  const result = {};
  // 遍历表单结构中的每个数组
  Object.keys(formStructure).forEach((arrayKey) => {
    // 初始化结果数组
    result[arrayKey] = [];

    // 根据不同的数组类型处理数据
    switch (arrayKey) {
      case 'levelItems':
        // 处理会员等级数据
        backendData?.forEach((item) => {
          result[arrayKey].push({
            vip_level: item.vip_level,
            vip_level_name: item.vip_level_name,
          });
        });
        break;

      case 'rechargeItems':
        // 处理充值金额数据
        backendData.forEach((item) => {
          result[arrayKey].push({
            recharge_amount: parseInt(item.recharge_amount),
            total_order_amount: parseInt(item.total_order_amount || 0),
            vip_level: item.vip_level,
          });
        });
        break;
      case 'exchangeItems':
        // 处理充值金额数据
        backendData.forEach((item) => {
          result[arrayKey].push({
            vip_level: item.vip_level,
            discount_percentage: item.discount_percentage,
            // 折扣范围
            rounding_off: item.rounding_off,
            // 折扣金额新值
            gift_amount: item.gift_amount,
            // 舍入量
            rounding_amount: item.rounding_amount,
          });
        });
        break;
      case 'setting_level_list_points':
        // 处理充值金额数据
        backendData.forEach((item) => {
          result[arrayKey].push({
            points_multiple: item.points_multiple,
            vip_level: item.vip_level,
          });
        });
        break;
      // 可以根据需要添加其他类型的数组处理
      default:
        // 如果有其他类型的数组，在这里添加处理逻辑
        break;
    }
  });

  return result;
};
// 表单结构数据
const dynamicItems = {
  levelItems: [
    {
      // 会员等级
      vip_level: null,
      vip_level_name: '',
    },
  ],
  rechargeItems: [
    {
      // 充值金额现金充值
      recharge_amount: '',
      // 累计消费金额
      total_order_amount: '',
      vip_level: null,
    },
  ],
  exchangeItems: [
    {
      points: null,
      //旧值
      amount: null,
      //折扣百分比
      discount_percentage: '',
      // 折扣范围
      rounding_off: '',
      // 折扣金额新值
      gift_amount: '',
      // 舍入量
      rounding_amount: '',
      vip_level: null,
    },
  ],

  setting_level_list_points: [
    {
      vip_level: null,
      // 旧值
      multiple: null,
      // 积分倍数
      points_multiple: '',
    },
  ],
};
const getData = () => {
  let setting_merchant_customer_rights_level_list = [];
  let setting_level_list_rights_type = [];
  let setting_level_list_upgrade_type = [];
  let setting_level_list_points = [];
  getCustomerEquityDetailApi().then((res) => {
    // hideField(res.point_exchange_type, formAPI);
    const list = res.setting_merchant_customer_rights_level_model_list.forEach(
      (element) => {
        debugger;
        setting_merchant_customer_rights_level_list.push({
          vip_level: element.vip_level,
          vip_level_name: element.vip_level_name,
        });
        setting_level_list_rights_type.push({
          vip_level: element.vip_level,
          total_order_amount_column: element.total_order_amount_column,
          recharge_amount_column: element.recharge_amount_column,
        });
        setting_level_list_upgrade_type.push({
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
    res.setting_merchant_customer_rights_level_list =
      setting_merchant_customer_rights_level_list;
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
