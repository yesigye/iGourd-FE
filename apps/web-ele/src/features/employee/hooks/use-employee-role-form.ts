import type { ISchema } from '@igourd/common-ui';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

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

  const [Drawer, drawerAPI] = useIgourdDrawer({
    // connectedComponent: () => import('./employee-role-drawer.vue'),
  });

  const { Form, formAPI } = useIgourdForm({
    schema: formSchema,
    onSubmit: async (values) => {
      try {
        await (values.role_id
          ? employeeApi.updateRole(values)
          : employeeApi.createRole(values));
        drawerAPI.close();
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
    drawerAPI,
  };
}
