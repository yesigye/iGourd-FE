import type { ISchema } from '@igourd/common-ui';

import { h } from 'vue';

import { action, ElButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  getCustomerLabelPageListApi,
  getCustomerPageListApi,
} from '@@/customer/apis';
import { getPriceListApi } from '@@/marketing/apis';
import { getCountryListApi } from '@@/setting/apis';

import { useDrawerForm } from '#/hooks/use-drawer-form';

const UploadButton = () => {
  return h(ElButton, {}, { default: () => '上传图片' });
};
export function useCustomerListForm() {
  const { t } = useI18n();

  const schema: ISchema = {
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
                properties: {
                  label_id_list: {
                    type: 'array',
                    title: t('list.customer-label'),
                    required: true,
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
                properties: {
                  salesman_id: {
                    type: 'string',
                    title: t('list.salesman'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Select',
                    'x-component-props': {
                      placeholder: t('common.select'),
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
                        'x-reactions': ['{{useAsyncDataSource(loadData)}}', {}],
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
              layout1: {
                type: 'void',
                'x-component': 'FormLayout',
                properties: {
                  name: {
                    type: 'string',
                    title: t('list.vendor-name'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: t('purchase.name'),
                    },
                  },
                  image: {
                    type: 'array',
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
                properties: {
                  effective_time: {
                    type: 'string',
                    title: t('list.effective-time'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: t('purchase.name'),
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
                    title: t('list.expiration-time'),
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                    'x-component-props': {
                      placeholder: t('purchase.name'),
                    },
                  },
                },
              },
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
                properties: {
                  price_level_id: {
                    type: 'string',
                    title: t('list.price-level'),
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
    const result = await getCustomerLabelPageListApi({
      page_num: 1,
      page_size: 100,
    });
    const option = result.list.map(
      (item: { label: string; value: string }) => ({
        label: item.name,
        value: item.id,
      }),
    );
    return new Promise((resolve) => {
      resolve(option);
    });
  };
  const loadPriceList = async (field: { props: { name: string } }) => {
    const result = await getPriceListApi({
      page_num: 1,
      page_size: 100,
    });
    const option = result.list.map(
      (item: { label: string; value: string }) => ({
        label: item.name,
        value: item.id,
      }),
    );
    return new Promise((resolve) => {
      resolve(option);
    });
  };
  // 获取销售员
  const loadSalesmanList = async (field: { props: { name: string } }) => {
    const result = await getCustomerPageListApi({
      page_num: 1,
      page_size: 100,
    });
    const option = result.list.map(
      (item: { label: string; value: string }) => ({
        label: item.name,
        value: item.id,
      }),
    );
    return new Promise((resolve) => {
      resolve(option);
    });
  };
  // 获取国家
  const loadCountryList = async (field: { props: { name: string } }) => {
    const result = await getCountryListApi({});
    const option = result.map((item: { label: string; value: string }) => ({
      label: item.name,
      value: item.id,
    }));
    return new Promise((resolve) => {
      resolve(option);
    });
  };
  // 获取手机区号
  const loadPhoneCodeList = async (field: { props: { name: string } }) => {
    const result = await getCountryListApi({});
    const option = result.map((item: { label: string; value: string }) => ({
      label: `${item.name} +${item.area_code}`,
      value: `+${item.area_code}`,
    }));
    return new Promise((resolve) => {
      resolve(option);
    });
  };
  return useDrawerForm({
    drawerOptions: {
      title: t('list.add-customer'),
      appendToMain: true,
      class: 'w-full',
    },
    formOptions: {
      schema: null,
      scope: {
        useAsyncDataSource,
        loadData,
        loadPriceList,
        loadSalesmanList,
        loadCountryList,
        loadPhoneCodeList,
        featureTypes: [
          { label: t('purchase.inputBox'), value: 'INPUT' },
          { label: t('purchase.selectBox'), value: 'SELECT' },
        ],

        // 选择类型（用户创建 / 固定值）
        // 注意：你原文件里 true=用户创建, false=固定值；保留相同语义
        selectTypes: [
          { label: t('purchase.userCreated'), value: true },
          { label: t('purchase.fixedValue'), value: false },
        ],

        // 是否必填
        compulsoryTypes: [
          { label: t('purchase.yes'), value: true },
          { label: t('purchase.no'), value: false },
        ],
      },
    },
  });
}
