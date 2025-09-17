import type { SaleEnterPageModel } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getSaleEnterPageListApi, deleteSaleEnterApi } from '@@/sale/apis';
import { SaleEnterDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function useSaleEnter() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<SaleEnterPageModel>[] = [
    {
      field: 'enter_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('sale.enterNo'),
      sortable: true,
    },
    {
      field: 'staff_name',
      width: 120,
      align: 'left',
      title: t('sale.staffName'),
      sortable: true,
    },
    {
      field: 'customer_name',
      width: 150,
      align: 'left',
      title: t('sale.customerName'),
      sortable: true,
    },
    {
      field: 'total_amount',
      width: 150,
      align: 'right',
      title: t('sale.totalAmount'),
      sortable: true,
    },
    {
      field: 'paid_amount',
      width: 150,
      align: 'right',
      title: t('sale.paidAmount'),
      sortable: true,
    },
    {
      field: 'status',
      width: 120,
      align: 'center',
      title: t('sale.status'),
      sortable: true,
    },
    {
      field: 'enter_date',
      width: 150,
      align: 'center',
      title: t('sale.enterDate'),
      sortable: true,
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('sale.creatorName'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('sale.createTime'),
      sortable: true,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async ({ page_num, page_size }: { page_num: number; page_size: number }) => {
      const response = await getSaleEnterPageListApi({ page_num, page_size });
      return {
        list: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除销售录入
    remove: async (data: { enter_id_list: number[] }) => {
      return await deleteSaleEnterApi(data);
    },
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
            placeholder: t('sale.searchPlaceholder'),
          },
        },
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('sale.status'),
            options: [
              { label: t('sale.status.draft'), value: 'DRAFT' },
              { label: t('sale.status.confirmed'), value: 'CONFIRMED' },
              { label: t('sale.status.processing'), value: 'PROCESSING' },
              { label: t('sale.status.completed'), value: 'COMPLETED' },
              { label: t('sale.status.cancelled'), value: 'CANCELLED' },
            ],
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: SaleEnterDrawer,
    });


  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
