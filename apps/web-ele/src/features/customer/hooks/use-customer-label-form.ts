import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui';
import { customerApi } from '../apis';

export function useCustomerLabelForm() {
  const { t } = useI18n();

  const formSchema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('customers.customerLabelName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('customers.pleaseEnterLabelName')}}",
          maxlength: 50,
          showWordLimit: true,
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
    connectedComponent: () => import('./customer-label-drawer.vue'),
  });

  const { Form, formAPI } = useIgourdForm({
    schema: formSchema,
    onSubmit: async (values) => {
      try {
        if (values.id) {
          await customerApi.updateLabel(values);
        } else {
          await customerApi.createLabel(values);
        }
        drawerApi.close();
        // 刷新列表
        window.location.reload();
      } catch (error) {
        console.error('保存失败:', error);
      }
    },
  });

  return {
    Drawer,
    Form,
    formAPI,
    drawerApi,
  };
}
