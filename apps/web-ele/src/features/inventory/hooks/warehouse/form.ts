import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { basicsCountryAreaList } from '#/api/common';
import { useDrawerForm } from '#/hooks/use-drawer-form';
import { validateEmailAll } from '#/utils';

const remoteMethod = (field: { props: { name: string } }) => {
  return basicsCountryAreaList({}).then((res) => {
    return res.map((item: any) => {
      return {
        label: `${item.name}+${item.area_code}`,
        value: item.country_id,
      };
    });
  });
};

export function useWarehouseForm() {
  const { t } = useI18n();

  const schema: ISchema = {
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
          name: {
            type: 'string',
            title: "{{t('warehouse.warehouse-name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('warehouse.please-warehouse-name')}}",
              },
            ],
          },
          country_id: {
            type: 'string',
            title: "{{t('warehouse.country')}}",
            'x-decorator': 'FormItem',
            'x-component': 'RemoteSelect',
            'x-component-props': {
              remoteMethod,
              maxLength: 32,
              placeholder: "{{t('common.select')}}",
              clearable: true,
            },
          },
          address: {
            type: 'string',
            title: "{{t('warehouse.address')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
          },
          contact_name: {
            type: 'string',
            title: "{{t('warehouse.contact-name')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
          },
          contact_telephone: {
            type: 'string',
            title: "{{t('warehouse.contact-telephone')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
            'x-validator': [
              {
                format:"phone",
                message:"{{t('warehouse.validate-phone')}}",
              }
            ]
          },
          email: {
            type: 'string',
            title: "{{t('warehouse.email')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
            'x-validator': [
              {
                format:"email",
                message:"{{t('warehouse.validate-email')}}",
              },
            ],
          },
          remark: {
            type: 'string',
            title: "{{t('warehouse.remarks')}}",
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 32,
              placeholder: "{{t('common.enter')}}",
              clearable: true,
            },
          },
        },
      },
    },
  };
  const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('warehouse.add-warehouse'),
      appendToMain: true,
      class: 'w-1/2',
      async onOpenChange(isOpen) {
        if (isOpen) {
          formAPI.reset();
          const data = drawerApi.getData();
          if (!data.selectionOptions) {
            data.selectionOptions = [];
          }
          formAPI.setFormState({ readPretty: data?.mode === 'detail' });
          formAPI.setValues(data);
        } else {
          formAPI.values = {
            selectionOptions: [],
          };
        }
      },
    },
    formOptions: {
      schema,
      scope: {},
    },
  });

  return { Drawer, Form, drawerApi, formAPI };
}
