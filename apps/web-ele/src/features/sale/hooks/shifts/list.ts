import type { SaleShiftsPageModel } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getSaleShiftsPageListApi } from '@@/sale/apis';
import { SaleShiftsDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function useSaleShifts() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<SaleShiftsPageModel>[] = [
    {
      field: 'shift_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('sale.shiftNo'),
    },
    {
      field: 'staff_name',
      width: 120,
      align: 'left',
      title: t('sale.staffName'),
    },
    {
      field: 'shift_type',
      width: 100,
      align: 'center',
      title: t('sale.shiftType'),
    },
    {
      field: 'status',
      width: 100,
      align: 'center',
      title: t('sale.status'),
    },
    {
      field: 'start_time',
      width: 150,
      align: 'center',
      title: t('sale.startTime'),
    },
    {
      field: 'end_time',
      width: 150,
      align: 'center',
      title: t('sale.endTime'),
    },
    {
      field: 'total_sales',
      width: 120,
      align: 'right',
      title: t('sale.totalSales'),
    },
    {
      field: 'total_orders',
      width: 100,
      align: 'center',
      title: t('sale.totalOrders'),
    },
    {
      field: 'cash_amount',
      width: 120,
      align: 'right',
      title: t('sale.cashAmount'),
    },
    {
      field: 'card_amount',
      width: 120,
      align: 'right',
      title: t('sale.cardAmount'),
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('sale.creatorName'),
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('sale.createTime'),
    },
  ];

  // 服务函数
  const service = {
    query: async ({
      page_num,
      page_size,
    }: {
      page_num: number;
      page_size: number;
    }) => {
      const response = await getSaleShiftsPageListApi({
        page_num,
        page_size,
           keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
      });
      return {
        list: response.data?.list || [],
        total: response.data?.total || 0,
      };
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
            placeholder: t('sale.keywordsPlaceholder'),
          },
        },
      },
      connectedComponent: SaleShiftsDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
