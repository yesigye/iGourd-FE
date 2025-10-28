import type { ISchema } from '@igourd/common-ui';

import { h, ref } from 'vue';

import { action, ElButton, useFieldSchema } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { basicsCountryAreaList } from '#/api/common';
import { useDrawerForm } from '#/hooks/use-drawer-form';
import { getDynamicColumnList } from '@@/inventory/apis';
import { generateSchema } from '#/utils';
import { getCountryListApi } from '@@/setting/apis';
import dayjs from 'dayjs';

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

export function useListForm() {
  const { t } = useI18n();
  const UploadButton = () => {
    return h(ElButton, {}, { default: () => t('common.upload-img') });
  };
  const userName = useUserStore().userInfo?.user_model.name;
  const userLabel = `${t('common.creator')}:`;

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
                      title: t('list.vendor-name'),
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.vendor-name'),
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
                    effective_time: {
                      type: 'string',
                      title: t('list.effective-time'),
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'DatePicker',
                      'x-component-props': {
                        placeholder: t('list.effective-time'),
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
                      'x-component': 'DatePicker',
                      'x-component-props': {
                        placeholder: t('list.expiration-time'),
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
                        placeholder: t('list.contact-name'),
                      },
                    },
                    currency_code: {
                      type: 'string',
                      title: t('list.country'),
                      'x-decorator': 'FormItem',
                      'x-component': 'RemoteSelect',
                      'x-component-props': {
                        remoteMethod,
                        placeholder: t('list.country'),
                      },
                    },
                    zip_code: {
                      type: 'string',
                      title: t('list.zip-code'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.zip-code'),
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
                      'x-component-props': {
                        fill: true,
                        size: [100],
                      },
                      properties: {
                        contact_country_area_code: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            placeholder: t('list.contact-telephone'),
                            class: 'w-[120px] flex-1',
                            style: {
                              width: '120px',
                            },
                          },
                          required: true,
                          'x-reactions': [
                            '{{useAsyncDataSource(loadData)}}',
                            {},
                          ],
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
                              message: t('list.validate-phone'),
                            },
                          ],
                        },
                      },
                    },
                    email: {
                      type: 'string',
                      //required: true,
                      title: t('list.email'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.email'),
                      },
                      'x-validator': [
                        {
                          required: true,
                        },
                        {
                          format: 'email',
                          message: t('list.validate-email'),
                        },
                      ],
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
                        placeholder: t('list.address'),
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
                  'x-component-props': {
                    labelCol: 6,
                    wrapperCol: 14,
                  },
                  properties: {
                    ...dynamicJson,
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
                  'x-component-props': {
                    labelCol: 6,
                    wrapperCol: 14,
                  },
                  properties: {
                    bank_name: {
                      type: 'string',
                      title: t('list.bank-name'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.bank-name'),
                      },
                    },
                    bank_account_name: {
                      type: 'string',
                      title: t('list.bank-account-name'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.bank-account-name'),
                      },
                    },
                    bank_account_number: {
                      type: 'string',
                      title: t('list.bank-account-number'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.bank-account-number'),
                      },
                    },
                    bank_swift_code: {
                      type: 'string',
                      title: t('list.bank-swift-code'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.bank-swift-code'),
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
                      title: t('list.currency'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.currency'),
                      },
                    },
                    balance: {
                      type: 'string',
                      title: t('list.opening-balance'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.opening-balance'),
                      },
                    },
                    tin_number: {
                      type: 'string',
                      title: t('list.tin-number'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.tin-number'),
                      },
                    },
                    tax_number: {
                      type: 'string',
                      title: t('list.tax-number'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: t('list.tax-number'),
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
                      title: t('list.bank-address'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input.TextArea',
                      'x-component-props': {
                        rows: '2',
                        size: 'small',
                        placeholder: t('list.bank-address'),
                      },
                    },
                    remark: {
                      type: 'string',
                      title: t('list.remarks'),
                      'x-decorator': 'FormItem',
                      'x-component': 'Input.TextArea',
                      'x-component-props': {
                        rows: '2',
                        placeholder: t('list.remarks'),
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
  const schemaObj = createSchema(null);

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
    const optionResult = await basicsCountryAreaList({});
    const option = optionResult.map(
      (item: { label: string; value: string }) => ({
        label: `${item.name}+${item.area_code}`,
        value: `+${item.area_code}`,
      }),
    );
    return new Promise((resolve) => {
      resolve(option);
    });
  };
  const getDynamicColumn = () => {
    getDynamicColumnList({ entity: 'VENDOR' }).then((res) => {
      const json = generateSchema(res.list);
      const filedSchema = useFieldSchema();
      const newSchema = createSchema(json);
      console.log(JSON.stringify(schemaObj.value));
      // formAPI.setProperties(newSchema);
    });
  };
  const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('purchase.add-vendor'),
      appendToMain: true,
      class: 'w-full',
      contentClass: 'bg-muted',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          if(data.effective_time){
            data.effective_time = dayjs(data.effective_time).format("YYYY-MM-DD")
          }
          formAPI.setValues(data);
           formAPI.setFormState({ readPretty: data?.mode === 'detail' });
          //getDynamicColumn()
        }
      },
    },
    formOptions: {
      schema: schemaObj,
      scope: {
        userLabel,
        userName,
        useAsyncDataSource,
        loadData,
        featureTypes: [
          { label: t('purchase.input-box'), value: 'INPUT' },
          { label: t('purchase.select-box'), value: 'SELECT' },
        ],

        // 选择类型（用户创建 / 固定值）
        // 注意：你原文件里 true=用户创建, false=固定值；保留相同语义
        selectTypes: [
          { label: t('purchase.user-created'), value: true },
          { label: t('purchase.fixed-value'), value: false },
        ],

        // 是否必填
        compulsoryTypes: [
          { label: t('purchase.yes'), value: true },
          { label: t('purchase.no'), value: false },
        ],
      },
    },
  });
  return { Drawer, Form, drawerApi, formAPI };
}
