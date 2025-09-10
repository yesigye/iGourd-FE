import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '#/adapter/drawer';
import { EmployeeService } from '../apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useEditEmployeeDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 基本信息
      basicInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.basicInfo')}}",
          defaultOpen: true,
        },
        properties: {
          name: {
            type: 'string',
            title: "{{t('employee.name')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseEnterName')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('employee.nameRequired')}}",
              },
            ],
          },
          phone: {
            type: 'string',
            title: "{{t('employee.phone')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseEnterPhone')}}",
              clearable: true,
            },
            'x-validator': [
              {
                required: true,
                message: "{{t('employee.phoneRequired')}}",
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "{{t('employee.phoneFormatError')}}",
              },
            ],
          },
          email: {
            type: 'string',
            title: "{{t('employee.email')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseEnterEmail')}}",
              clearable: true,
            },
            'x-validator': [
              {
                format: 'email',
                message: "{{t('employee.emailFormatError')}}",
              },
            ],
          },
          gender: {
            type: 'string',
            title: "{{t('employee.gender')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectGender')}}",
              clearable: true,
              options: [
                { label: "{{t('employee.male'), value: 'MALE' },
                { label: "{{t('employee.female'), value: 'FEMALE' },
                { label: "{{t('employee.other'), value: 'OTHER' },
              ],
            },
          },
        },
      },

      // 工作信息
      workInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.workInfo')}}",
          defaultOpen: true,
        },
        properties: {
          birthday: {
            type: 'string',
            title: "{{t('employee.birthday')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectBirthday')}}",
              format: 'YYYY-MM-DD',
              valueFormat: 'YYYY-MM-DD',
            },
          },
          department: {
            type: 'string',
            title: "{{t('employee.department')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectDepartment')}}",
              clearable: true,
              // 这里需要动态加载选项
            },
          },
          position: {
            type: 'string',
            title: "{{t('employee.position')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseEnterPosition')}}",
              clearable: true,
            },
          },
          salary: {
            type: 'number',
            title: "{{t('employee.salary')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseEnterSalary')}}",
              min: 0,
              precision: 2,
            },
          },
          hireDate: {
            type: 'string',
            title: "{{t('employee.hireDate')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'DatePicker',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectHireDate')}}",
              format: 'YYYY-MM-DD',
              valueFormat: 'YYYY-MM-DD',
            },
          },
          status: {
            type: 'string',
            title: "{{t('employee.status')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectStatus')}}",
              options: [
                { label: "{{t('employee.active'), value: 'ACTIVE' },
                { label: "{{t('employee.inactive'), value: 'INACTIVE' },
              ],
            },
          },
        },
      },

      // 其他信息
      otherInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.otherInfo')}}",
          defaultOpen: false,
        },
        properties: {
          address: {
            type: 'string',
            title: "{{t('employee.address')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseEnterAddress')}}",
              clearable: true,
            },
          },
          remark: {
            type: 'string',
            title: "{{t('employee.remark')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              type: 'textarea',
              placeholder: "{{t('employee.pleaseEnterRemark')}}",
              maxlength: 200,
              showWordLimit: true,
              rows: 3,
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
      id: '',
      name: '',
      phone: '',
      email: '',
      gender: '',
      birthday: '',
      department: '',
      position: '',
      salary: 0,
      hireDate: '',
      status: 'ACTIVE',
      address: '',
      remark: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('employee.editEmployee')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const data = {
          ...values,
          merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
        };

        const res = await EmployeeService.updateEmployee(data);
        if (String(res?.code) === 'SUCCESS') {
          drawerApi.close();
          return true;
        }
      } catch (error) {
        console.error('更新员工失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (employeeData?: any) => {
    if (employeeData) {
      formApi.setValues(employeeData);
    } else {
      formApi.reset();
    }
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
  };
}
