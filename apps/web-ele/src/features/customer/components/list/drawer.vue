<script setup lang="ts">
import { h, ref } from 'vue';

import { ElButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCustomerListForm } from '@@/customer/hooks';
import { getDynamicColumnList } from '@@/inventory/apis';
import { getCountryListApi } from '@@/setting/apis';

import { generateSchema } from '#/utils';

const UploadButton = () => {
  return h(ElButton, {}, { default: () => t('common.upload-img') });
};
const { t } = useI18n();
const schemaInfo = ref('');
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
      card1: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          header: t('list.basic-information'),
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
                    title: t('list.customer-name'),
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: t('list.customer-name'),
                    },
                  },
                  profile_photo: {
                    type: 'string',
                    title: t('list.image'),
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
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 14,
                },
                properties: {
                  label_id_list: {
                    type: 'array',
                    title: t('list.customer-label'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: t('common.select'),
                      multiple: true,
                    },
                    'x-reactions': ['{{useAsyncDataSource(loadData)}}', {}],
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
                  salesman_id: {
                    type: 'string',
                    title: t('list.salesman'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: t('common.select'),
                    },
                    'x-reactions': [
                      '{{useAsyncDataSource(loadSalesmanList)}}',
                      {},
                    ],
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
          header: t('list.contact-information'),
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
                    title: t('list.contact-name'),
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: t('common.enter'),
                    },
                  },
                  currency_code: {
                    type: 'string',
                    title: t('list.country'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: t('common.enter'),
                    },
                    'x-reactions': [
                      '{{useAsyncDataSource(loadCountryList)}}',
                      {},
                    ],
                  },
                  zip_code: {
                    type: 'string',
                    title: t('list.zip-code'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: t('common.enter'),
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
                    title: t('list.contact-telephone'),
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      asterisk: true,
                      feedbackLayout: 'none',
                    },
                    'x-component': 'Space',
                    properties: {
                      contact_country_area_code: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                          placeholder: t('common.enter'),
                          class: 'w-[120px] flex-1',
                          style: {
                            width: '120px',
                          },
                        },
                        'x-reactions': [
                          '{{useAsyncDataSource(loadPhoneCodeList)}}',
                          {},
                        ],
                      },
                      contact_telephone: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-component-props': {
                          class: 'w-full',
                        },
                      },
                    },
                  },
                  email: {
                    type: 'string',
                    title: t('list.email'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: t('common.enter'),
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
                  address: {
                    type: 'string',
                    title: t('list.address'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Input.TextArea',
                    'x-component-props': {
                      placeholder: t('common.enter'),
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
          header: t('list.customized-information'),
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
          labelCol: 6,
          wrapperCol: 14,
          header: t('list.financial-information'),
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
                  price_level_id: {
                    type: 'string',
                    title: t('list.price-level'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: t('common.enter'),
                    },
                    'x-reactions': [
                      '{{useAsyncDataSource(loadPriceList)}}',
                      {},
                    ],
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
                  remarks: {
                    type: 'string',
                    title: t('list.remarks'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Input.TextArea',
                    'x-component-props': {
                      placeholder: t('common.enter'),
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
const isLoad = ref(false);
const getDynamicColumn = () => {
  getDynamicColumnList({ entity: 'CUSTOMER' }).then((res) => {
    const json = generateSchema(res.list);
    const newSchema = createSchema(json);
    schemaInfo.value = newSchema;
    isLoad.value = true;
  });
};

const { Drawer, Form } = useCustomerListForm();
getDynamicColumn();
</script>

<template>
  <Drawer>
    <Form v-if="isLoad" :schema="schemaInfo" />
  </Drawer>
</template>
