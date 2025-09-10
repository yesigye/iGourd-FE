import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui';
import { employeeApi } from '../apis';

export function useEmployeeRoleForm() {
  const { t } = useI18n();
  
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('employee.roleName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('employee.pleaseEnterRoleName')}}",
          maxlength: 50,
          showWordLimit: true,
        },
      },
      remark: {
        type: 'string',
        title: "{{t('employee.roleDesc')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input.TextArea',
        'x-component-props': {
          placeholder: "{{t('employee.pleaseEnterRoleDesc')}}",
          rows: 3,
          maxlength: 500,
          showWordLimit: true,
        },
      },
    },
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: () => import('./employee-role-drawer.vue'),
  });

  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    onSubmit: async (values) => {
      try {
        if (values.role_id) {
          await employeeApi.updateRole(values);
        } else {
          await employeeApi.createRole(values);
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
    formApi,
    drawerApi,
  };
}