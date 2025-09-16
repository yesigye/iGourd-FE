import type { RoleDTO, RoleRow } from '@@/employee/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  createRoleApi,
  deleteRoleApi,
  getRoleListApi,
  updateRoleApi,
} from '@@/employee/apis';
import { RoleDrawer } from '@@/employee/components';

import { useCrud } from '#/hooks';

export function useRole() {
  const { t } = useI18n();
  const columns: VxeGridPropTypes.Column<RoleRow>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('employee.roleName'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'code',
      title: t('employee.roleCode'),
      minWidth: 150,
      sortable: true,
      align: 'left',
    },
    {
      field: 'description',
      title: t('employee.description'),
      minWidth: 200,
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

  return useCrud<RoleRow, RoleDTO>({
    columns,
    searchFormSchema,
    batchOperate: true,
    connectedComponent: RoleDrawer,
    service: {
      query: getRoleListApi,
      drop: deleteRoleApi,
      create: createRoleApi,
      update: updateRoleApi,
    },
  });
}
