<script setup lang="ts">
import { action, ElButton } from '@igourd/common-ui';
import { useListForm } from '@@/purchase/hooks';
import { getDynamicColumnList } from '@@/inventory/apis';
import { generateSchema } from '#/utils';
import { getCountryListApi } from '@@/setting/apis';
import { h, ref } from 'vue';
import { useI18n } from '@igourd/locales';
const { t } = useI18n();
const UploadButton = () => {
  return h(ElButton, {}, { default: () => t('common.upload-img') });
};
function remoteMethod(keywords: string) {
  return getCountryListApi({}).then((res) => {
    return res?.map((item: any) => {
      return {
        ...item,
        label: item.name,
        value: item.country_id,
      };
    });
  });
}

const createSchema = (dynamicJson) => {
  return {
    type: 'object',
    properties: {
      card0: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          header: '',
          bodyClass: 'py-0 px-1 my-1 border-0',
        },
        properties: {
          label: {
            type: 'void',
            'x-component': 'Space',
            'x-component-props': {},
            properties: {
              c: {
                type: 'void',
                'x-component': 'div',
                'x-content': '{{userLabel}}',
                'x-component-props': {
                  style: { fontSize: '14px' },
                },
              },
              d: {
                type: 'void',
                'x-component': 'div',
                'x-content': '{{userName}}',
                'x-component-props': {
                  class: 'text-red-500',
                },
              },
            },
          },
        },
      },
      card1: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          header: "{{t('list.basic-information')}}",
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              minColumns: 3,
              maxColumns: 3,
            },
            properties: {
              layout1: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 14,
                },
                properties: {
                  name: {
                    type: 'string',
                    title: "{{t('list.vendor-name')}}",

                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.vendor-name')}}",
                    },
                    'x-validator':[
                      {required: true}
                    ]
                  },
                  profile_photo: {
                    type: 'string',
                    title: "{{t('list.image')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Upload',
                    'x-component-props': {
                      action: 'https://formily-vue.free.beeceptor.com/file',
                    },
                    'x-content': UploadButton,
                  },
                },
              },
              layout2: {
                type: 'void',
                'x-component': 'FormLayout',
                properties: {

                  effective_time: {
                    type: 'string',
                    title: "{{t('list.effective-time')}}",
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'DatePicker',
                    'x-component-props': {
                      placeholder: "{{t('list.effective-time')}}",
                    },
                  },
                },
              },
              layout3: {
                type: 'void',
                'x-component': 'FormLayout',
                properties: {
                  expiration_time: {
                    type: 'string',
                    title: "{{t('list.expiration-time')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'DatePicker',
                    'x-component-props': {
                      placeholder: "{{t('list.expiration-time')}}",
                    },
                  },
                },
              },
            },
          },
        },
      },
      card2: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          header: "{{t('list.contact-information')}}",
          class: 'mt-2',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              minColumns: 3,
              maxColumns: 3,
            },
            properties: {
              layout1: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 14,
                },
                properties: {
                  contact_name: {
                    type: 'string',
                    title: "{{t('list.contact-name')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.contact-name')}}",
                    },
                    'x-validator':[
                      {required: true}
                    ]
                  },
                  currency_code: {
                    type: 'string',
                    title: "{{t('list.country')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'RemoteSelect',
                    'x-component-props': {
                      remoteMethod,
                      placeholder: "{{t('list.country')}}",
                    },
                  },
                  zip_code: {
                    type: 'string',
                    title: "{{t('list.zip-code')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.zip-code')}}",
                    },
                  },
                },
              },
              layout2: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 14,
                },
                properties: {
                  contact: {
                    type: 'void',
                    title: "{{t('list.contact-telephone')}}",
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      asterisk: true,
                      feedbackLayout: 'none',
                    },
                    'x-component': 'Space',
                    'x-component-props': {
                      fill: true,
                    },
                    properties: {
                      contact_country_area_code: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                          placeholder: "{{t('list.contact-telephone')}}",
                          class: 'w-[120px] flex-1',
                          style: {
                            width: '120px',
                          },
                        },
                        required: true,
                        'x-reactions': ['{{useAsyncDataSource(loadData)}}', {}],
                      },
                      contact_telephone: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        //required: true,
                        'x-decorator-props': {
                          class: 'w-full',
                        },
                        'x-validator': [
                          {
                            required: true,
                          },
                          {
                            format: 'phone',
                            message: "{{t('list.validate-phone')}}",
                          },
                        ],
                      },
                    },
                  },
                  email: {
                    type: 'string',
                    //required: true,
                    title: "{{t('list.email')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.email')}}",
                    },
                    'x-validator': [
                      {
                        required: true,
                      },
                      {
                        format: 'email',
                        message: "{{t('list.validate-email')}}",
                      },
                    ],
                  },
                },
              },
              layout3: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 14,
                },
                properties: {
                  address: {
                    type: 'string',
                    title: "{{t('list.address')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input.TextArea',
                    'x-component-props': {
                      placeholder: "{{t('list.address')}}",
                    },
                  },
                },
              },
            },
          },
        },
      },
      card3: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          header: "{{t('list.customized-information')}}",
          class: 'mt-2',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              minColumns: 3,
              maxColumns: 3,
            },
            properties: {
              ...dynamicJson,
            },
          },
        },
      },
      card4: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          header: "{{t('list.financial-information')}}",
          class: 'mt-2',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              minColumns: 3,
              maxColumns: 3,
            },
            properties: {
              layout1: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 14,
                },
                properties: {
                  bank_name: {
                    type: 'string',
                    title: "{{t('list.bank-name')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.bank-name')}}",
                    },
                  },
                  bank_account_name: {
                    type: 'string',
                    title: "{{t('list.bank-account-name')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.bank-account-name')}}",
                    },
                  },
                  bank_account_number: {
                    type: 'string',
                    title: "{{t('list.bank-account-number')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.bank-account-number')}}",
                    },
                  },
                  bank_swift_code: {
                    type: 'string',
                    title: "{{t('list.bank-swift-code')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.bank-swift-code')}}",
                    },
                  },
                },
              },
              layout2: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 14,
                },
                properties: {
                  currency_code: {
                    type: 'string',
                    title: "{{t('list.currency')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.currency')}}",
                    },
                  },
                  balance: {
                    type: 'string',
                    title: "{{t('list.opening-balance')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.opening-balance')}}",
                    },
                  },
                  tin_number: {
                    type: 'string',
                    title: "{{t('list.tin-number')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.tin-number')}}",
                    },
                  },
                  tax_number: {
                    type: 'string',
                    title: "{{t('list.tax-number')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: "{{t('list.tax-number')}}",
                    },
                  },
                },
              },
              layout3: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 14,
                },
                properties: {
                  bank_address: {
                    type: 'string',
                    title: "{{t('list.bank-address')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input.TextArea',
                    'x-component-props': {
                      rows: '2',
                      size: 'small',
                      placeholder: "{{t('list.bank-address')}}",
                    },
                  },
                  remark: {
                    type: 'string',
                    title: "{{t('list.remarks')}}",
                    'x-decorator': 'FormItem',
                    'x-component': 'Input.TextArea',
                    'x-component-props': {
                      rows: '2',
                      placeholder: "{{t('list.remarks')}}",
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
};

const { Drawer, Form } = useListForm();
const schemaObj = ref();
const isLoad = ref(false);
const getDynamicColumn = () => {
  getDynamicColumnList({ entity: 'VENDOR' }).then((res) => {
    const json = generateSchema(res.list);
    console.log(json);
    const newSchema = createSchema(json);
    schemaObj.value = newSchema;
    console.log(newSchema);
    isLoad.value = true;
  });
};

getDynamicColumn();
</script>

<template>
  <Drawer>
    <!-- 表单抽屉组件 -->
    <Form v-if="isLoad" :schema="schemaObj" />
  </Drawer>
</template>
