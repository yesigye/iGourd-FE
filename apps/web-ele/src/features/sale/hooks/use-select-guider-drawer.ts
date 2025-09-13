import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { EmployeeService } from '../../employee/apis';
import { Local } from '@/utils';
import type { ISchema } from '@igourd/common-ui';

export function useSelectGuiderDrawer() {
  const { t } = useI18n();

  // 表单 Schema
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      // 搜索条件
      searchConditions: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('employee.searchConditions')}}",
          defaultOpen: true,
        },
        properties: {
          employeeName: {
            type: 'string',
            title: "{{t('employee.employeeName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseEnterEmployeeName')}}",
              clearable: true,
            },
          },
          employeeCode: {
            type: 'string',
            title: "{{t('employee.employeeCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Input',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseEnterEmployeeCode')}}",
              clearable: true,
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
            },
          },
          position: {
            type: 'string',
            title: "{{t('employee.position')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('employee.pleaseSelectPosition')}}",
              clearable: true,
            },
          },
        },
      },

      // 导购员列表
      guiderList: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.guiderList')}}",
          defaultOpen: true,
        },
        properties: {
          selectedGuider: {
            type: 'string',
            title: "{{t('sales.selectedGuider')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Select',
            'x-component-props': {
              placeholder: "{{t('sales.pleaseSelectGuider')}}",
              clearable: true,
              showSearch: true,
              filterable: true,
            },
            enum: [],
            'x-validator': [
              {
                required: true,
                message: "{{t('sales.pleaseSelectGuider')}}",
              },
            ],
          },
        },
      },

      // 导购员信息
      guiderInfo: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('sales.guiderInfo')}}",
          defaultOpen: true,
        },
        properties: {
          guiderName: {
            type: 'string',
            title: "{{t('sales.guiderName')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          guiderCode: {
            type: 'string',
            title: "{{t('sales.guiderCode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          department: {
            type: 'string',
            title: "{{t('employee.department')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'PreviewText',
            'x-component-props': {
              style: { color: '#666' },
            },
          },
          phone: {
            type: 'string',
            title: "{{t('employee.phone')}}",
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
    },
  };

  // 使用 useIgourdForm
  const { Form, formApi } = useIgourdForm({
    schema: formSchema,
    initialValues: {
      employeeName: '',
      employeeCode: '',
      department: '',
      position: '',
      selectedGuider: '',
      guiderName: '',
      guiderCode: '',
      department: '',
      phone: '',
    },
  });

  // 使用 useIgourdDrawer
  const [Drawer, drawerApi] = useIgourdDrawer({
    title: "{{t('sales.selectGuider')}}",
    width: '86%',
    onConfirm: async () => {
      try {
        const values = formAPI.values
        const selectedGuider = values.selectedGuider;

        if (!selectedGuider) {
          return false;
        }

        drawerApi.close();
        return true;
      } catch (error) {
        console.error('选择导购员失败:', error);
        return false;
      }
    },
    onCancel: () => {
      formApi.reset();
      drawerApi.close();
    },
  });

  const openDrawer = (title?: string) => {
    formApi.reset();
    loadGuiderList();
    drawerApi.open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  const loadGuiderList = async () => {
    try {
      const res = await EmployeeService.getGuiderList({
        merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id,
      });
      if (String(res?.code) === 'SUCCESS') {
        const options = res.data.map((item: any) => ({
          label: `${item.name} (${item.code})`,
          value: item.id,
        }));
        formApi.setFieldState('selectedGuider', {
          componentProps: {
            enum: options,
          },
        });
      }
    } catch (error) {
      console.error('加载导购员列表失败:', error);
    }
  };

  const onGuiderChange = (guiderId: string) => {
    if (guiderId) {
      loadGuiderDetail(guiderId);
    } else {
      formApi.setValues({
        guiderName: '',
        guiderCode: '',
        department: '',
        phone: '',
      });
    }
  };

  const loadGuiderDetail = async (guiderId: string) => {
    try {
      const res = await EmployeeService.getEmployeeDetail(guiderId);
      if (String(res?.code) === 'SUCCESS') {
        formApi.setValues({
          guiderName: res.data.name || '',
          guiderCode: res.data.code || '',
          department: res.data.department || '',
          phone: res.data.phone || '',
        });
      }
    } catch (error) {
      console.error('加载导购员详情失败:', error);
    }
  };

  return {
    Drawer,
    Form,
    drawerApi,
    formApi,
    openDrawer,
    closeDrawer,
    loadGuiderList,
    onGuiderChange,
  };
}
