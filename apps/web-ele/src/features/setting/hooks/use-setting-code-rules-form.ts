import type { ISchema } from '@igourd/common-ui';

import { ref } from 'vue';

import {
  action,
  onFieldValueChange,
  onFormValuesChange,
  useIgourdDrawer,
  useIgourdForm,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import dayjs from 'dayjs';

import {
  codingCategoryDetail,
  codingCategoryModify,
  codingRuleList,
} from '../apis/rules';
// import { createOrUpdateCustomizedField } from '../apis';

// 定义表单数据类型
interface PurchaseCodeRulesFormData {
  type: string;
  paragraph_break: string;
  code_section: string;
  use_rule: string;
  status: boolean;
  category_type: string;
  id: string;
}

export function useSettingCodeRulesForm() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const codingRuleListData = ref<PurchaseCodeRulesFormData[]>([]);
  // 数据数据处理
  // 表单提交处理
  const handleSubmit = async (values: PurchaseCodeRulesFormData) => {
    try {
      // 处理选项数据
      const partList = [];
      values?.setting_coding_rule_part_list?.forEach((item, index) => {
        const info =
          codingRuleListData.value?.setting_coding_rule_part_list.find(
            (partItem) => partItem.part_name === item.part_name,
          ) || '';
        switch (item.part_name) {
          case 'CONSTANT': {
            partList.push({
              id: info?.id || '',
              // setting_system_coding_rule_id:
              //   info?.setting_system_coding_rule_id || '',
              merchant_id: currentLoginUserApp.user_id,
              part_name: item.part_name,
              part_value: item.value,
              part_value_length: '',
              setting_merchant_coding_rule_id: values.id,
              sort: index + 1,
            });
            break;
          }
          case 'RECEIPT_TIME': {
            partList.push({
              id: info?.id || '',
              merchant_id: currentLoginUserApp.user_id,
              part_name: item.part_name,
              part_value: item.receipt_time,
              part_value_length: '',
              setting_merchant_coding_rule_id: values.id,
              sort: index,
            });
            break;
          }
          case 'SERIAL_NO': {
            partList.push({
              id: info?.id || '',
              merchant_id: currentLoginUserApp.user_id,
              part_name: item.part_name,
              part_value: item.initialValue,
              part_value_length: item.part_value_length,
              setting_merchant_coding_rule_id: values.id,
              sort: index,
            });
            break;
          }
        }
      });
      const parms = {
        ...values,
        setting_coding_rule_part_list: partList,
        status: values.status ? 'OPEN' : 'CLOSE',
        use_rule: values.use_rule === 1,
      };

      // 调用 API
      const response = await codingCategoryModify({
        ...parms,
      });
      return response;
    } catch (error) {
      console.error('Purchase customized form submission error:', error);
      throw error;
    }
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: t('code-rules.coding-rules'),
    appendToMain: true,
    class: 'w-full',
    async onOpenChange(isOpen) {
      if (isOpen) {
        const row = drawerApi.getData();
        const result = await codingCategoryDetail({
          merchant_id: currentLoginUserApp.user_id,
          id: row.id,
        });
        const formdata = result;
        codingRuleListData.value = result;
        formdata.category_type = t(`code-rules.${formdata?.category_type}`);
        const { option_map, ...other } = formdata;
        formAPI.setValues({
          ...other,
          id: row.id,
          use_rule: formdata.use_rule ? 1 : 0,
        });
        if (!row.id) {
          formAPI.reset();
        }
      }
    },
    onClosed() {
      formAPI.reset();
    },
    async onConfirm() {
      await formAPI.validate();
      drawerApi.lock();
      await handleSubmit(formAPI.values as PurchaseCodeRulesFormData)
        .then(() => {
          drawerApi.close();
        })
        .finally(() => {
          drawerApi.unlock();
        });
    },
  });

  // 表单 Schema - 基于原有的自定义字段表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 3,
          minColumns: 2,
        },
        properties: {
          category_type: {
            type: 'string',
            title: 'order type',
            'x-decorator': 'FormItem',
            'x-component': 'input',
            'x-component-props': {
              maxLength: 32,
              placeholder: 'purchase order',
              clearable: true,
              readOnly: true,
            },
          },
          paragraph_break: {
            type: 'string',
            title: 'paragraph break',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              placeholder: 'purchase order',
              clearable: true,
            },
            'x-reactions': ['{{useAsyncDataSource(loadData)}}', {}],
          },
          code_section: {
            type: 'object',
            title: 'Code Section',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              maxLength: 32,
              placeholder: 'purchase order',
              clearable: true,
              readOnly: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseEnterFeatureName')}}",
              },
              { max: 64, message: "{{t('common.maxChars', { n: 64 })}}" },
            ],
            'x-reactions': ['{{useAsyncDataSource(loadData)}}'],
          },
          use_rule: {
            type: 'object',
            title: 'use rules',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [
              {
                label: '允许用户编辑单据号',
                value: 1,
              },
              {
                label: '不允许',
                value: 0,
              },
            ],
            'x-component-props': {
              placeholder: 'purchase order',
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseEnterFeatureName')}}",
              },
              { max: 64, message: "{{t('common.maxChars', { n: 64 })}}" },
            ],
          },
          status: {
            type: 'boolean',
            title: 'status',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
              maxLength: 32,
              placeholder: 'purchase order',
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('purchase.pleaseEnterFeatureName')}}",
              },
              { max: 64, message: "{{t('common.maxChars', { n: 64 })}}" },
            ],
          },
        },
      },
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          setting_coding_rule_part_list: {
            type: 'array',
            'x-component': 'ArrayCards',
            maxItems: 3,
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              className: 'code-rules-array-cards',
            },
            'x-reactions': [
              {
                dependencies: ['paragraph_break'],
                fulfill: {
                  state: {
                    value:
                      '{{$deps[0] ? Array.from({length: Number($deps[0]) || 0}, () => ({})) : []}}',
                  },
                },
              },
            ],
            items: {
              type: 'object',
              properties: {
                part_name: {
                  type: 'string',
                  title: `Code Part`,
                  'x-reactions': [
                    '{{useAsyncDataSource(loadData)}}',
                    // {
                    //   dependencies: [
                    //     'setting_coding_rule_part_list',
                    //     '.part_name',
                    //   ],
                    //   when: '{{$deps[0].some(item => item.part_name === $deps[1])}}',
                    //   fulfill: {
                    //     state: {
                    //       dataSource: `{{(field) => {
                    //         const options = field.dataSource || [];
                    //         console.log('options', options);
                    //         return options.map(option => ({
                    //           ...option,
                    //           disabled: $deps[0].some(item => item.part_name === option.value && item.part_name === $deps[1])
                    //         }));
                    //       }}}`,
                    //     },
                    //   },
                    // },
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                },
                value: {
                  type: 'string',
                  title: 'set value',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-reactions': [
                    {
                      dependencies: ['.part_name'],
                      when: "{{$deps[0] ==='CONSTANT'}}",
                      fulfill: {
                        schema: {
                          'x-visible': true,
                        },
                      },
                      otherwise: {
                        schema: {
                          'x-visible': false,
                        },
                      },
                    },
                  ],
                },
                receipt_time: {
                  type: 'string',
                  title: 'Date format',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-reactions': [
                    '{{useAsyncDataSource(loadData)}}',
                    {
                      dependencies: ['.part_name'],
                      when: "{{$deps[0] ==='RECEIPT_TIME'}}",
                      fulfill: {
                        schema: {
                          'x-visible': true,
                        },
                      },
                      otherwise: {
                        schema: {
                          'x-visible': false,
                        },
                      },
                    },
                  ],
                },
                part_value_length: {
                  type: 'string',
                  title: 'length',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-reactions': [
                    '{{useAsyncDataSource(loadData)}}',
                    {
                      dependencies: ['.part_name'],
                      when: "{{$deps[0] ==='SERIAL_NO'}}",
                      fulfill: {
                        schema: {
                          'x-visible': true,
                        },
                      },
                      otherwise: {
                        schema: {
                          'x-visible': false,
                        },
                      },
                    },
                  ],
                },
                initialValue: {
                  type: 'string',
                  title: 'Initial value',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-reactions': [
                    {
                      dependencies: ['.part_name'],
                      when: "{{$deps[0] ==='SERIAL_NO'}}",
                      fulfill: {
                        schema: {
                          'x-visible': true,
                        },
                      },
                      otherwise: {
                        schema: {
                          'x-visible': false,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  };
  const useAsyncDataSource = (service) => (field) => {
    field.loading = true;
    service(field).then(
      action?.bound((data) => {
        field.dataSource = data;
        field.loading = false;
      }),
    );
  };

  const loadData = async (field: { props: { name: string } }) => {
    const optionAll = {
      paragraph_break: [] as {
        label: string;
        value: string;
      }[],
      code_section: [] as { label: string; value: string }[],
      part: [] as { label: string; value: string }[],
      receipt_time: [] as { label: string; value: string }[],
      serial_no_length: [] as { label: string; value: string }[],
    };
    const optionResult = await codingRuleList({});

    for (const key in optionResult.option_map) {
      if (key === 'PART_NAME') {
        optionAll[key.toLocaleLowerCase()] = optionResult.option_map[key].map(
          (item: { label: string; value: string }) => ({
            label: item.default_value,
            value: item.default_value,
            disabled: item.disabled,
          }),
        );
      } else {
        optionAll[key.toLocaleLowerCase()] = optionResult.option_map[key].map(
          (item: { label: string; value: string }) => ({
            label: item.default_value,
            value: item.default_value,
          }),
        );
      }
    }
    return new Promise((resolve) => {
      resolve(optionAll[field.props.name]);
    });
  };

  const codeRulesInfo = ref({
    preview: '',
    rules: '',
  });
  // 使用 useIgourdForm
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    readPretty: false,
    initialValues: {
      type: '',
      paragraph_break: '',
      code_section: '',
      use_rule: '',
      status: false,
      setting_coding_rule_part_list: [],
      id: '',
    },
    effects() {
      // 使用 Formily 的 effects 监听表单值变化
      onFormValuesChange((form) => {
        const { values } = form;

        // 预览信息
        const preview = [] as string[];
        const rules = [] as string[];
        values.setting_coding_rule_part_list.forEach(
          (item: {
            part_name: string;
            receipt_time: string;
            value: string;
          }) => {
            switch (item.part_name) {
              case 'CONSTANT': {
                preview.push(item.value);
                break;
              }
              case 'RECEIPT_TIME': {
                // 将小写的y替换成大写的Y
                let forDateTime = item.receipt_time;
                if (forDateTime) {
                  forDateTime = forDateTime.replaceAll('y', 'Y');
                  forDateTime = forDateTime.replaceAll('d', 'D');
                }
                const time = dayjs(new Date()).format(
                  forDateTime || 'YYYYMMDD',
                );
                preview.push(time);
                break;
              }
              case 'SERIAL_NO': {
                preview.push(item.initialValue);
                break;
              }
            }
            if (item.part_name) {
              rules.push(item.part_name);
            }
          },
        );
        codeRulesInfo.value = {
          preview: preview.join(values.code_section),
          rules: rules.join(values.code_section),
        };
      });
      onFieldValueChange(['setting_coding_rule_part_list'], (field, form) => {
        console.log('part_name', field.value, form);
      });
    },
    scope: {
      useAsyncDataSource,
      loadData,
    },
  });
  // 表单重置
  const resetForm = () => {
    formAPI.reset();
  };

  return {
    Form,
    formAPI,
    Drawer,
    drawerApi,
    formSchema,
    codeRulesInfo,
    handleSubmit,
    resetForm,
  };
}
