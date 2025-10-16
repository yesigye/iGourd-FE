<template>
  <Page auto-content-height>
    <ElCard>
      <Form></Form>
      <div class="mt-4 text-center">
        <ElButton type="danger" plain @click="handleReset">重置</ElButton>
        <ElButton type="primary" @click="handleSave">保存</ElButton>
      </div>
    </ElCard>
    <Drawer @confirm="handleConfirm"></Drawer>
  </Page>
</template>

<script setup lang="ts">
import { onMounted,ref } from 'vue';
import type { ISchema } from '@igourd/common-ui';
import {
  ElButton,
  Page,
  ElMessage,
  ElCard,
  onFieldValueChange,
  useIgourdDrawer,
  useIgourdForm
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import {
  getCustomerIntegralDetailApi,
  saveCustomerIntegralApi,
} from '@@/customer/apis';
import drawer from '../../components/integral/drawer.vue';
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true
});
const index = ref();
const handleSelectProduct = (...args) => {
  index.value = args[0];
  drawerApi.open();
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
            row_0: {
              type: 'void', // 表示空字段
              title: '初始获得积分', // formItem 的 label
              'x-component': 'Space',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                asterisk: true,
                feedbackLayout: 'none',
              },
              properties: {
                initial_points: {
                  type: 'string',
                  title: '',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入初始积分',
                    clearable: true,
                    style: {
                      width: '120px',
                    },
                  },
                },
                checkbox: {
                  type: 'number',
                  title: '默认',
                  'x-decorator': 'FormItem',
                  'x-component': 'Checkbox',
                },
              },
            },
            row_1: {
              type: 'void', // 表示空字段
              title: '每消费', // formItem 的 label
              'x-component': 'Space',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                asterisk: true,
                feedbackLayout: 'none',
              },
              properties: {
                exchange_rate: {
                  type: 'string',
                  title: '',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    // addonAfter: '',
                    style: {
                      width: '120px',
                    },
                  },
                  'x-component-props': {
                    placeholder: '请输入消费金额',
                    clearable: true,
                  },
                },
                checkbox: {
                  type: 'void',
                  title: '',
                  'x-decorator': 'FormItem',
                  'x-component': 'div',
                  'x-content': '获得1积分',
                },
              },
            },

            card_0: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: '积分兑换规则',
              },
              properties: {
                point_exchange_type: {
                  type: 'boolean',
                  title: '兑换方式设置',
                  enum: [
                    {
                      label: '抵扣现金',
                      value: 'DEDUCTIBLE_CASH',
                    },
                    {
                      label: '兑换奖品',
                      value: 'EXCHANGE_GIFTS',
                    },
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  'x-component-props': {},
                },
                deduction_rate: {
                  type: 'string',
                  title: '积分规则',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    addonAfter: '获得 1 现金',
                  },
                  'x-component-props': {
                    placeholder: '请输入消费金额',
                    clearable: true,
                    style: {
                      width: '120px',
                    },
                  },
                },
                setting_merchant_point_gift_list: {
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-decorator': 'FormItem',
                  title: '积分规则',
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
                        'x-component-props': { width: 200, title: '积分' },
                        properties: {
                          points: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      column3: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { width: 400, title: '礼品' },
                        properties: {
                          name: {
                            type: 'void',
                            title: '',
                            'x-decorator': 'FormItem',
                            'x-decorator-props': {
                              asterisk: true,
                              feedbackLayout: 'none',
                            },
                            'x-component': 'Space',
                            properties: {
                              list: {
                                type: 'array',
                                'x-decorator': 'FormItem',
                                'x-component': 'Select',
                                enum: [
                                  { value: '1', label: '111' },
                                  { value: '2', label: '222' },
                                ],
                                'x-component-props': {
                                  multiple: true,
                                  // disabled: true,
                                },
                              },
                              lastName: {
                                type: 'string',
                                'x-decorator': 'FormItem',
                                'x-component': 'div',
                                'x-content': '选择',
                                'x-component-props': {
                                  class: 'cursor-pointer',
                                  '@click': `{{
                                    ()=> handleSelectProduct($index,$record)
                                  }}`,
                                },
                              },
                              lastName1: {
                                type: 'string',
                                'x-decorator': 'FormItem',
                                'x-component': 'PreviewText.Input',
                                default: '8选择',
                              },
                            },
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
                                'setting_merchant_point_gift_list',
                              ],
                              fulfill: {
                                state: {
                                  componentProps: {
                                    disabled: false,
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
                                'setting_merchant_point_gift_list',
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
                header: '其他设置',
              },
              properties: {
                is_annually_resettable: {
                  type: 'string',
                  title: '每年1月1日零点重置积分为0',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                  'x-decorator-props': {
                    asterisk: false, // label 上显示必填的 * 号
                    feedbackLayout: 'none',
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
const hideField = (type, form) => {
  switch (type) {
    case 'DEDUCTIBLE_CASH': {
      form.setFieldState('deduction_rate', (f) => {
        f.hidden = false;
      });
      form.setFieldState('setting_merchant_point_gift_list', (f) => {
        f.hidden = true;
      });
      break;
    }
    case 'EXCHANGE_GIFTS': {
      form.setFieldState('deduction_rate', (f) => {
        f.hidden = true;
      });
      form.setFieldState('setting_merchant_point_gift_list', (f) => {
        f.hidden = false;
      });

      break;
    }
  }
};

const { Form, formAPI } = useIgourdForm({
  useI18n,
  schema: formSchema,
  readPretty: false,
  initialValues: {
    setting_merchant_point_gift_list: [{}],
  },
  effects() {
    onFieldValueChange('point_exchange_type', (field, form: Form) => {
      hideField(field.value, form);
      if (field.value === 'EXCHANGE_GIFTS') {
        form.setValuesIn('setting_merchant_point_gift_list', [{}]);
      }
    });
  },
  scope: {
    handleSelectProduct,
  },
});
const handleReset = () => {
  formAPI.reset();
  ElMessage.success('重置成功');
};
const handleSave = () => {
  //gift_product_ids:[]
  // setting_merchant_point_gift_list:[]
  saveCustomerIntegralApi(formAPI.values).then((res) => {
    ElMessage.success('保存成功');
  });
};
const getData = () => {
  getCustomerIntegralDetailApi().then((res) => {
    hideField(res.point_exchange_type, formAPI);
    formAPI.setValues(res);
  });
};

const handleConfirm = (data) => {
  formAPI.setValuesIn("setting_merchant_point_gift_list["+index.value+"].list",data.product_list)
};

defineOptions({
  name: 'ICustomerIntegral',
});
onMounted(() => {
  getData();
});
</script>
