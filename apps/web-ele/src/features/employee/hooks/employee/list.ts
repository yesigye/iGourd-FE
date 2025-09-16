import type { EmployeeDTO, EmployeeRow } from '@@/employee/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createEmployeeApi,
  deleteEmployeeApi,
  getEmployeeListApi,
  updateEmployeeApi,
  updateEmployeeStatusApi,
} from '@@/employee/apis';
import { EmployeeDrawer } from '@@/employee/components';

import { useCrud } from '#/hooks';

export function useEmployee() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<EmployeeRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('employee.employeeName'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'code',
      title: t('employee.employeeCode'),
      minWidth: 120,
      sortable: true,
      align: 'left',
    },
    {
      field: 'phone',
      title: t('employee.phone'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'email',
      title: t('employee.email'),
      minWidth: 150,
      align: 'left',
    },
    {
      field: 'department',
      title: t('employee.department'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'position',
      title: t('employee.position'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'status',
      title: t('employee.status'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'ElSwitch',
        props: {
          modelValue: '{{row.status === "active"}}',
          activeValue: 'active',
          inactiveValue: 'inactive',
          onChange: '{{$event => handleStatusChange(row, $event)}}',
        },
      },
    },
    {
      field: 'create_time',
      title: t('common.createTime'),
      width: 160,
      sortable: true,
      align: 'center',
    },
    {
      field: 'operation',
      title: t('common.operation'),
      width: 120,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
    department: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('employee.department')}}",
        clearable: true,
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('employee.status')}}",
        clearable: true,
        options: [
          { label: t('employee.statusOptions.active'), value: 'active' },
          { label: t('employee.statusOptions.inactive'), value: 'inactive' },
        ],
      },
    },
  };

  return useCrud<EmployeeRow, EmployeeDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: EmployeeDrawer,
    service: {
      query: getEmployeeListApi,
      drop: deleteEmployeeApi,
      create: createEmployeeApi,
      update: updateEmployeeApi,
    },
  });
}
