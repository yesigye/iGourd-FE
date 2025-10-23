<template>
  <Page auto-content-height>
    <ElCard>
      <Form></Form>
      <div class="mt-4 text-center">
        <ElButton type="danger" plain @click="handleReset">{{
          t('common.reset')
        }}</ElButton>
        <ElButton type="primary" @click="handleSave">{{
          t('common.save')
        }}</ElButton>
      </div>
    </ElCard>
    <Drawer @confirm="handleConfirm"></Drawer>
  </Page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ISchema } from '@igourd/common-ui';
import {
  ElButton,
  Page,
  ElMessage,
  ElCard,
  onFieldValueChange,
  useIgourdDrawer,
  useIgourdForm,
  observable,
} from '@igourd/common-ui';
import { useUserStore } from '@igourd/stores';
import { useI18n } from '@igourd/locales';
const { t } = useI18n();
import {
  getCustomerIntegralDetailApi,
  saveCustomerIntegralApi,
} from '@@/customer/apis';
import drawer from '../../components/integral/drawer.vue';
const [Drawer, drawerApi] = useIgourdDrawer({
  connectedComponent: drawer,
  appendToMain: true,
});
interface ListItem {
  value: any;
  label: string;
}
const { currentLoginUserApp } = useUserStore();
const currentIndex = ref();
const id = ref();
const dataSource = observable<{ value: ListItem[] }>({ value: [] });
// 已有礼物数据
const giftList = ref([]);
const handleSelectProduct = (_, op, record, index) => {
  currentIndex.value = index;
  const gift = dataSource.value[index];
  drawerApi.setData(gift).open();
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
              title: "{{t('customer.initial-earned-integral')}}", // formItem 的 label
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
                  'x-component': 'InputNumber',
                  'x-component-props': {
                    placeholder:
                      "{{t('integral.initialearnedintegral-placeholder')}}",
                    clearable: true,
                    style: {
                      width: '120px',
                    },
                  },
                },
                checkbox: {
                  type: 'number',
                  title: "{{t('common.default')}}",
                  'x-decorator': 'FormItem',
                  'x-component': 'Checkbox',
                },
              },
            },
            row_1: {
              type: 'void', // 表示空字段
              title: "{{t('customer.every-consumption')}}", // formItem 的 label
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
                    placeholder: "{{t('integral.amount-placeholder')}}",
                    clearable: true,
                  },
                },
                checkbox: {
                  type: 'void',
                  title: '',
                  'x-decorator': 'FormItem',
                  'x-component': 'div',
                  'x-content': "{{t('integral.gain-points')}}",
                },
              },
            },

            card_0: {
              type: 'void',
              'x-component': 'Card',
              'x-component-props': {
                header: "{{t('customer.point-redemption-rule')}}",
              },
              properties: {
                point_exchange_type: {
                  type: 'boolean',
                  title: "{{t('customer.exchange-mode')}}",
                  required: true,
                  enum: [
                    {
                      label: t('customer.deductible-cash'),
                      value: 'DEDUCTIBLE_CASH',
                    },
                    {
                      label: t('customer.redeem'),
                      value: 'EXCHANGE_GIFTS',
                    },
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Radio.Group',
                  'x-component-props': {},
                },
                row_deduction_rate: {
                  type: 'void', // 表示空字段
                  title: "{{t('customer.integration-rule')}}", // formItem 的 label
                  'x-component': 'Space',
                  'x-decorator': 'FormItem',
                  'x-decorator-props': {
                    asterisk: true,
                    feedbackLayout: 'none',
                  },
                  properties: {
                    deduction_rate: {
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
                        placeholder: "{{t('integral.amount-placeholder')}}",
                        clearable: true,
                      },
                    },
                    checkbox: {
                      type: 'void',
                      title: '',
                      'x-decorator': 'FormItem',
                      'x-component': 'div',
                      'x-content': "{{t('integral.gain-money')}}",
                    },
                  },
                },

                setting_merchant_point_gift_list: {
                  type: 'array',
                  'x-component': 'ArrayTable',
                  'x-decorator': 'FormItem',
                  required: true,
                  title: "{{t('customer.integration-rule')}}",
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
                          title: "{{t('equity.equity-type.point')}}",
                        },
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
                        'x-component-props': {
                          title: "{{t('equity.equity-type.gift')}}",
                        },
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
                              gift_product_ids: {
                                type: 'string',
                                'x-decorator': 'FormItem',
                                'x-component': 'Select',
                                'x-reactions': {
                                  fulfill: {
                                    state: {
                                      dataSource:
                                        '{{ dataSource.value[$index] }}',
                                    },
                                  },
                                },
                                'x-component-props': {
                                  style: {
                                    'min-width': '200px',
                                  },
                                  multiple: true,
                                  disabled: true,
                                  'collapse-tags': true,
                                  'max-collapse-tags': 3,
                                },
                              },
                              lastName: {
                                type: 'string',
                                'x-decorator': 'FormItem',
                                'x-component': 'div',
                                'x-content': "{{t('common.select')}}",
                                'x-component-props': {
                                  class: 'cursor-pointer',
                                  style: { color: 'var(--el-color-primary)' },
                                  '@click': `{{
                                    (value,op)=> handleSelectProduct(value,op,$self,$index)
                                  }}`,
                                },
                              },
                              count: {
                                type: 'string',
                                'x-decorator': 'FormItem',
                                'x-component': 'PreviewText.Input',
                                'x-content': "{{$self.value?$self.value:'0'}}",
                              },
                            },
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
                            title: "{{t('common.add-btn')}}",
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
                header: "{{t('customer.other-settings')}}",
              },
              properties: {
                is_annually_resettable: {
                  type: 'string',
                  title:
                    "{{t('integral.everyyearonjanuary1resetpointstozero')}}",
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
      form.setFieldState('row_deduction_rate', (f) => {
        f.hidden = false;
      });
      form.setFieldState('setting_merchant_point_gift_list', (f) => {
        f.hidden = true;
      });
      break;
    }
    case 'EXCHANGE_GIFTS': {
      form.setFieldState('row_deduction_rate', (f) => {
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
    is_annually_resettable: false,
  },
  effects() {
    onFieldValueChange('point_exchange_type', (field, form: Form) => {
      hideField(field.value, form);
      if (
        field.value === 'EXCHANGE_GIFTS' &&
        (!formAPI.values.setting_merchant_point_gift_list ||
          formAPI.values.setting_merchant_point_gift_list?.lenght === 0)
      ) {
        form.setValuesIn('setting_merchant_point_gift_list', [{}]);
      }
    });
  },
  scope: {
    handleSelectProduct,
    dataSource,
  },
});
const handleReset = () => {
  // 判断勾选 default，需要重新获取数据
  if (formAPI.values.checkbox) {
    getData();
  } else {
    formAPI.reset();
    ElMessage.success(t('customer.reset-success'));
  }
};
const handleSave = async () => {
  await formAPI.validate();
  let params = JSON.parse(JSON.stringify(formAPI.values));
  //对象转json
  params.setting_merchant_point_gift_list.forEach((element) => {
    element.merchant_id = currentLoginUserApp.owner_id;
    if (element.gift_product_ids && element.gift_product_ids.length > 0) {
      element.gift_product_ids = JSON.stringify(element.gift_product_ids);
    }
    element.setting_merchant_point_id = null;
  });
  params.id = id.value;
  saveCustomerIntegralApi(params).then((res) => {
    id.value = res;
    ElMessage.success(t('customer.save-success'));
  });
};
const getData = () => {
  getCustomerIntegralDetailApi().then((res) => {
    hideField(res.point_exchange_type, formAPI);
    giftList.value = res.setting_merchant_point_gift_list;
    res.setting_merchant_point_gift_list?.forEach((element) => {
      const list = element.product_model_list.map((item) => {
        return {
          ...item,
          value: item.id,
          label: item.major_name,
        };
      });
      const selectedList = element.product_model_list.map((item) => item.id);
      element.gift_product_ids = selectedList;
      element.count = selectedList.length + t('integral.product');
      dataSource.value.push(list);
    });
    id.value = res.id;
    formAPI.setValues(res);
  });
};

const handleConfirm = async (data) => {
  if (!data.product_list) {
    return;
  }
  // 新添加 dataSource里还没有
  if (!dataSource.value[currentIndex.value]) {
    dataSource.value.push([{}]);
  }
  const list = data.product_list.map((item) => {
    return {
      ...item,
      value: item.id,
      label: item.major_name,
    };
  });
  const selectedList = data.product_list.map((item) => item.id);
  dataSource.value[currentIndex.value] = list;
  formAPI.setValuesIn(
    'setting_merchant_point_gift_list[' +
      currentIndex.value +
      '].gift_product_ids',
    selectedList,
  );
  formAPI.setValuesIn(
    'setting_merchant_point_gift_list[' + currentIndex.value + '].count',
    data.product_list.length + t('integral.product'),
  );
};

defineOptions({
  name: 'ICustomerIntegral',
});
onMounted(() => {
  getData();
});
</script>
