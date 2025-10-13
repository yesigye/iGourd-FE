<template>
  <Page auto-content-height>
    <Form></Form>
  </Page>
</template>

<script setup lang="ts">
import type { ISchema } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useIgourdForm } from '@igourd/common-ui';
import { Page } from '@igourd/common-ui';
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
                product_spec_value1: {
                  type: 'string',
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
                product_spec_value2: {
                  type: 'string',
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
                product_spec_value3: {
                  type: 'string',
                  title: 'VIP编码',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    // addonAfter: '',
                  },
                  'x-component-props': {
                    placeholder: '请输入VIP编码',
                    clearable: true,
                  },
                },

                array: {
                  type: 'array',
                  title: ' ',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayTable',
                  items: {
                    type: 'object',
                    properties: {
                      column1: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          width: 80,
                          title: '序号',
                          align: 'center',
                        },
                        properties: {
                          index: {
                            type: 'void',
                            'x-component': 'ArrayTable.Index',
                          },
                        },
                      },
                      column3: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { width: 200, title: 'A2' },
                        properties: {
                          a2: {
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Select',
                          },
                        },
                      },
                      column4: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { title: 'A3' },
                        properties: {
                          a3: {
                            type: 'string',
                            'x-decorator': 'FormItem',
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
                          add: {
                            type: 'void',
                            'x-component': 'ArrayTable.Addition',
                          },
                          remove: {
                            type: 'void',
                            'x-component': 'ArrayTable.Remove',
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
                header: '升级模式设置',
              },
              properties: {
                radio: {
                  type: 'boolean',
                  title: '会员升级模式',
                  enum: [
                    {
                      label: '充值',
                      value: 1,
                    },
                    {
                      label: '累计消费',
                      value: 2,
                    },
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  'x-component-props': {
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
               radio: {
                  type: 'boolean',
                  title: '优惠模式',
                  enum: [
                    {
                      label: '现金',
                      value: 1,
                    },
                    {
                      label: '折扣',
                      value: 2,
                    },
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  'x-component-props': {
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
                status: {
                  type: 'string',
                  title: '积分倍数',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                  'x-decorator-props': {
                    asterisk: false, // label 上显示必填的 * 号
                    feedbackLayout: 'none',
                  },
                  'x-component-props': {
                    'active-value': 'OPEN',
                    'inactive-value': 'CLOSED',
                  },
                },
                status1: {
                  type: 'string',
                  title: '享受优惠有效期',
                  'x-decorator': 'FormItem',
                  'x-component': 'Switch',
                  'x-decorator-props': {
                    asterisk: false, // label 上显示必填的 * 号
                    feedbackLayout: 'none',
                  },
                  'x-component-props': {
                    'active-value': 'OPEN',
                    'inactive-value': 'CLOSED',
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
    review_status: 'APPROVED',
  },
  effects() {},
  scope: {},
});
defineOptions({
  name: 'ICustomerIntegral',
});
</script>
