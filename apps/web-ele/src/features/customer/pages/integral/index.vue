<template>
  <Page auto-content-height>
    <ElCard>
      <Form></Form>
      <div class="mt-4 text-center">
        <ElButton type="danger" plain @click="handleReset">重置</ElButton>
        <ElButton type="primary" @click="handleSave">保存</ElButton>
      </div>
    </ElCard>
  </Page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { ISchema } from '@igourd/common-ui';
import {
  ElButton,
  Page,
  ElMessage,
  ElCard,
  onFieldValueChange,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import {
  getCustomerIntegralDetailApi,
  saveCustomerIntegralApi,
} from '@@/customer/apis';
import { useIgourdForm } from '@igourd/common-ui';

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
                string_array: {
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
                          a1: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      column3: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { width: 200, title: '礼品' },
                        properties: {
                          a1: {
                            type: 'string',
                            'x-component': 'Input',
                          },
                        },
                      },
                      column5: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          title: 'Operations',
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
                      title: '添加条目',
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
      form.setFieldState('string_array', (f) => {
        f.hidden = true;
      });
      break;
    }
    case 'EXCHANGE_GIFTS': {
      form.setFieldState('deduction_rate', (f) => {
        f.hidden = true;
      });
      form.setFieldState('string_array', (f) => {
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
  initialValues: {},
  effects() {
    onFieldValueChange('point_exchange_type', (field, form: Form) => {
      hideField(field.value, form);
    });
  },
  scope: {},
});
const handleReset = () => {
  formAPI.reset();
  ElMessage.success('重置成功');
};
const handleSave = () => {
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

defineOptions({
  name: 'ICustomerIntegral',
});
onMounted(() => {
  getData();
});
</script>
