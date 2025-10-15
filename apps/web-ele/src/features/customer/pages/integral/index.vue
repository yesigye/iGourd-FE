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
                product_spec_value: {
                  type: 'string',
                  title: '',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入初始积分',
                    clearable: true,
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
                product_spec_value1: {
                  type: 'string',
                  title: '',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-decorator-props': {
                    // addonAfter: '',
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
                radio: {
                  type: 'boolean',
                  title: '兑换方式设置',
                  enum: [
                    {
                      label: '兑换奖品',
                      value: 1,
                    },
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  'x-component-props': {},
                },
                string_array: {
                  type: 'array',
                  'x-component': 'ArrayItems',
                  'x-decorator': 'FormItem',
                  title: ' ',
                  items: {
                    type: 'void',
                    'x-component': 'Space',
                    properties: {
                      checkbox: {
                        type: 'void',
                        title: '',
                        'x-decorator': 'FormItem',
                        'x-component': 'div',
                        'x-content': '可用',
                      },
                      input: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-decorator-props': {
                          addonAfter: '兑换礼品 0 种',
                        },
                      },
                      remove: {
                        type: 'void',
                        'x-decorator': 'FormItem',
                        'x-component': 'ArrayItems.Remove',
                      },
                    },
                  },
                  properties: {
                    add: {
                      type: 'void',
                      title: '添加兑换规则',
                      'x-component': 'ArrayItems.Addition',
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
                status: {
                  type: 'string',
                  title: '每年1月1日零点重置积分为0',
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
