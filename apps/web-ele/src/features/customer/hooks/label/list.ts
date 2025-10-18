import type { CustomerLabelPageModel } from '@@/customer/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getCustomerLabelPageListApi,
  deleteCustomerLabelApi,
} from '@@/customer/apis';
import { CustomerLabelDrawer } from '@@/customer/components';

import { useCrud } from '#/hooks';

export function useCustomerLabel() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<CustomerLabelPageModel>[] = [
    {
      field: 'name',
      minWidth: 200,
      align: 'center',
      fixed: 'left',
      title: t('label.curtomer-label'),
      sortable: true,
    },
    {
      field: 'creator_name',
      minWidth: 150,
      align: 'center',
      title: t('label.customer-qty'),
      sortable: true,
    },
    {
      field: 'operation',
      title: t('common.operations'),
      sortable: true,
      minWidth: 180,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getCustomerLabelPageListApi,

    // 删除客户标签
    remove: async (data: { label_id_list: number[] }) => {
      return await deleteCustomerLabelApi(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      id: 'label',
      columns: baseColumns,
      searchFormSchema: "",
      batchOperate: true, // 支持批量删除
      connectedComponent: CustomerLabelDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
