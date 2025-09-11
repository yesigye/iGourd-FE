import { useI18n } from '@igourd/locales';
import {
  useIgourdDrawer,
  useIgourdForm,
  type ISchema,
} from '@igourd/common-ui';
import { customerApi } from '../apis';
import CustomerFeatureDrawer from '../components/customer-feature-drawer.vue';

export function useCustomerFeatureForm() {
  const { t } = useI18n();

  const formSchema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('customers.name')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('customers.pleaseEnterName')}}",
          maxlength: 50,
          showWordLimit: true,
        },
      },
      type: {
        type: 'string',
        title: "{{t('customers.type')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('customers.pleaseSelectType')}}",
          options: [
            { label: "{{t('inventory.select')}}", value: 'SELECT' },
            { label: "{{t('inventory.input')}}", value: 'INPUT' },
          ],
        },
      },
      is_fixed_option: {
        type: 'boolean',
        title: "{{t('customers.isFixedOption')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Radio.Group',
        'x-component-props': {
          options: [
            { label: "{{t('inventory.fixed')}}", value: true },
            { label: "{{t('inventory.userCreated')}}", value: false },
          ],
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'is_compulsory.visible': '{{$self.value === true}}',
              },
            },
          },
        ],
      },
      is_compulsory: {
        type: 'boolean',
        title: "{{t('customers.isCompulsory')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Radio.Group',
        'x-component-props': {
          options: [
            { label: "{{t('common.yes')}}", value: true },
            { label: "{{t('common.no')}}", value: false },
          ],
        },
      },
      remark: {
        type: 'string',
        title: "{{t('customers.remark')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input.TextArea',
        'x-component-props': {
          placeholder: "{{t('customers.pleaseEnterRemark')}}",
          rows: 3,
          maxlength: 500,
          showWordLimit: true,
        },
      },
    },
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: CustomerFeatureDrawer,
  });

  const { Form, formAPI } = useIgourdForm({
    schema: formSchema,
    useI18n,
    scope: {},
  });

  return {
    Drawer,
    Form,
    formAPI,
    drawerApi,
  };
}
