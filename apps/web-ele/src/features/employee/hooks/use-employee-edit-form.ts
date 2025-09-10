import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdForm } from '@igourd/common-ui';
import { employeeApi } from '../apis';
import type { ISchema } from '@igourd/common-ui';

// 定义表单数据类型
interface EmployeeEditFormData {
  role_id: string;
  name: string;
  login_ids: Array<{
    type: string;
    login_account: string;
  }>;
  roles: Array<{
    role_id: string;
    name: string;
  }>;
  user_id: string;
  old_role_id: string;
}

export function useEmployeeEditForm() {
  const { t } = useI18n();

  // 表单 Schema - 基于原有的员工编辑表单结构
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基础信息部分
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.basicInformation')}}",
          defaultOpen: true,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('employee.userName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          phone_num: {
            type: 'string',
            title: "{{t('employee.phoneNumber')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          email: {
            type: 'string',
            title: "{{t('employee.email')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          login_id: {
            type: 'string',
            title: "{{t('employee.loginId')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
        },
      },

      // 角色配置部分
      roleConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.roleConfig')}}",
          defaultOpen: true,
        },
        properties: {
          role_id: {
            type: 'string',
            title: "{{t('employee.role')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectRole')}}",
              style: { width: '300px' },
            },
            'x-reactions': [
              {
                dependencies: ['.'],
                fulfill: {
                  state: {
                    'passwordConfig.visible': '{{$self.value}}',
                  },
                },
              },
            ],
          },
        },
      },

      // 密码管理部分
      passwordConfig: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.passwordManagement')}}",
          defaultOpen: true,
        },
        'x-reactions': [
          {
            dependencies: ['role_id'],
            fulfill: {
              state: {
                visible: '{{$deps[0]}}',
              },
            },
          },
        ],
        properties: {
          password_reset: {
            type: 'void',
            title: "{{t('employee.password')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'ElButton',
            'x-component-props': {
              type: 'danger',
              children: t('common.reset'),
            },
          },
        },
      },
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      role_id: '',
      name: '',
      login_ids: [],
      roles: [],
      user_id: '',
      old_role_id: '',
    },
  });

  // 表单提交处理
  const handleSubmit = async (values: EmployeeEditFormData) => {
    try {
      // 调用 API
      const response = await employeeApi.updateUser({
        name: values.name,
        role_id: values.role_id,
        user_id: values.user_id,
        old_role_id: values.old_role_id,
      });
      return response;
    } catch (error) {
      console.error('Employee edit form submission error:', error);
      throw error;
    }
  };

  // 表单重置
  const resetForm = () => {
    formApi.reset();
  };

  // 表单验证
  const validateForm = async () => {
    return await formApi.validate();
  };

  // 设置表单值
  const setFormValues = (values: Partial<EmployeeEditFormData>) => {
    formApi.setValues(values);
  };

  // 获取表单值
  const getFormValues = () => {
    return formAPI.values
  };

  // 获取员工详情
  const getEmployeeDetail = async (userId: string) => {
    try {
      const response = await employeeApi.getUserById(userId);
      return response;
    } catch (error) {
      console.error('Get employee detail error:', error);
      throw error;
    }
  };

  // 获取角色列表
  const getRoleList = async () => {
    try {
      const response = await employeeApi.getCurrentRoleList();
      return response;
    } catch (error) {
      console.error('Get role list error:', error);
      throw error;
    }
  };

  // 重置密码
  const resetPassword = async (userId: string) => {
    try {
      const response = await employeeApi.resetPassword(userId);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  return {
    // 组件
    Form,
    formApi,

    // 配置
    formSchema,

    // 方法
    handleSubmit,
    resetForm,
    validateForm,
    setFormValues,
    getFormValues,
    getEmployeeDetail,
    getRoleList,
    resetPassword,
  };
}
