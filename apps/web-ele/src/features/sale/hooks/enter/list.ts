import type { SaleEnterPageModel } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteSaleEnterApi, getSaleEnterPageListApi } from '@@/sale/apis';
import { SaleEnterDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

export function useSaleEnter() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<SaleEnterPageModel>[] = [
    {
      field: 'settlement_date',
      width: 180,
      align: 'center',
      fixed: 'left',
      title: t('enter.settlement-date'),
      sortable: true,
    },
    {
      field: 'order_quantity',
      width: 180,
      align: 'center',
      title: t('enter.order-qty'),
      sortable: true,
    },
    {
      field: 'order_total_amount',
      width: 180,
      align: 'center',
      title: t('enter.order-amount'),
      sortable: true,
    },
    {
      field: 'order_returned_quantity',
      width: 180,
      align: 'center',
      title: t('enter.returned-qty'),
      sortable: true,
    },
    {
      field: 'order_returned_total_amount',
      width: 180,
      align: 'center',
      title: t('enter.refund-amount'),
      sortable: true,
    },
    {
      field: 'order_holding_quantity',
      width: 120,
      align: 'center',
      title: t('enter.holding-order-qty'),
      sortable: true,
    },
    {
      field: 'order_holding_total_amount',
      width: 180,
      align: 'center',
      title: t('enter.holding-order-amount'),
      sortable: true,
    },
    {
      field: 'customer_recharge_quantity',
      width: 180,
      align: 'center',
      title: t('enter.recharge-qty'),
      sortable: true,
    },
    {
      field: 'customer_recharge_total_amount',
      width: 180,
      align: 'center',

      title: t('enter.recharge-amount'),
      sortable: true,
    },
    {
      field: 'accounting_note_revenue_count',
      width: 180,
      align: 'center',

      title: t('enter.accounting-note-revenue-qty'),
      sortable: true,
    },
    {
      field: 'accounting_note_revenue_amount',
      width: 180,
      align: 'center',

      title: t('enter.accounting-note-revenue-amount'),
      sortable: true,
    },
    {
      field: 'accounting_note_expenditure_count',
      width: 180,
      align: 'center',

      title: t('enter.accounting-note-expenditure-qty'),
      sortable: true,
    },
    {
      field: 'accounting_note_expenditure_amount',
      width: 180,
      align: 'center',

      title: t('enter.accounting-note-expenditure-amount'),
      sortable: true,
    },

    {
      field: 'start_time',
      width: 180,
      align: 'center',

      title: t('common.start-time'),
      sortable: true,
    },
    {
      field: 'end_time',
      width: 180,
      align: 'center',

      title: t('common.end-time'),
      sortable: true,
    },
    {
      field: 'creator_name',
      width: 180,
      align: 'center',

      title: t('common.creator'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',

      title: t('common.creation-time'),
      sortable: true,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async ({
      page_num,
      page_size,
      ...other
    }: {
      page_num: number;
      page_size: number;
    }) => {
      const response = await getSaleEnterPageListApi({
        page_num,
        page_size,
        ...other,
      });
      return {
        list: response?.list || [],
        total: response?.total || 0,
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
      id: 'enter',
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('enter.search-placeholder'),
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
