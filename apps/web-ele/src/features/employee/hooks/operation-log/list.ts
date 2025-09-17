import type { OperationLogPageModel } from '@@/employee/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getOperationLogPageListApi } from '@@/employee/apis';
import { EmployeeDrawer } from '@@/employee/components';

import { useCrud } from '#/hooks';

export function useOperationLog() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<OperationLogPageModel>[] = [
    {
      field: 'operator_name',
      width: 206,
      align: 'left',
      title: t('employee.operatorName'),
      sortable: true,
    },
    {
      field: 'account',
      width: 206,
      align: 'left',
      title: t('employee.account'),
      sortable: true,
    },
    {
      field: 'operation_type',
      width: 206,
      align: 'left',
      title: t('employee.operationType'),
      sortable: true,
    },
    {
      field: 'operation_description',
      width: 300,
      align: 'left',
      title: t('employee.operationDescription'),
      sortable: true,
    },
    {
      field: 'ip_address',
      width: 150,
      align: 'left',
      title: t('employee.ipAddress'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 206,
      align: 'left',
      title: t('employee.employee_create_time'),
      sortable: true,
    },
    {
      field: 'status',
      width: 206,
      align: 'left',
      title: t('employee.employee_status'),
      sortable: true,
    },
  ];
  // 服务函数
  const service = {
    // 获取列表数据
    query: getOperationLogPageListApi,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('employee.pleaseOperationLog'),
          },
        },
      },
      batchOperate: false, // 操作日志不需要批量操作
      connectedComponent: EmployeeDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
