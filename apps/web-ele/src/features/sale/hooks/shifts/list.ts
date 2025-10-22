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
      field: 'logout_pos_user_name',
      width: 180,
      align: 'center',
      fixed: 'left',
      title: t('shifts.employee'),
    },
    {
      field: 'shift_date',
      width: 120,
      align: 'left',
      title: t('shifts.shift-date'),
    },
    {
      field: 'order_quantity',
      width: 100,
      align: 'center',
      title: t('shifts.sales-order'),
    },
    {
      field: 'order_total_amount',
      width: 100,
      align: 'center',
      title: t('shifts.sales-amt'),
    },
    {
      field: 'on_credit_order_quantity',
      width: 150,
      align: 'center',
      title: t('shifts.credit-order'),
    },
    {
      field: 'on_credit_order_total_amount',
      width: 150,
      align: 'center',
      title: t('shifts.credit-amt'),
    },
    {
      field: 'repayment_order_quantity',
      width: 120,
      align: 'right',
      title: t('shifts.repayment-order'),
    },
    {
      field: 'repayment_order_total_amount',
      width: 100,
      align: 'center',
      title: t('shifts.repayment-amt'),
    },
    {
      field: 'order_returned_quantity',
      width: 120,
      align: 'right',
      title: t('shifts.returned-order'),
    },
    {
      field: 'order_returned_total_amount',
      width: 100,
      align: 'center',
      title: t('shifts.returned-amt'),
    },
    {
      field: 'order_holding_quantity',
      width: 120,
      align: 'right',
      title: t('shifts.holding-order'),
    },
    {
      field: 'order_holding_total_amount',
      width: 120,
      align: 'center',
      title: t('shifts.holding-amt'),
    },
    {
      field: 'customer_recharge_quantity',
      width: 180,
      align: 'center',
      title: t('shifts.recharge-qty'),
    },
    {
      field: 'customer_recharge_total_amount',
      width: 180,
      align: 'center',
      title: t('shifts.recharge-amt'),
    },
    {
      field: 'cash_amount',
      width: 180,
      align: 'center',
      title: t('shifts.cash-rev'),
      children: [
        {
          field: 'cash_amount',
          width: 180,
          align: 'center',

          title: t('shifts.total'),
        },
        {
          field: 'cash_expenditure_amount',
          width: 180,
          align: 'center',

          title: t('shifts.sales'),
        },
        {
          field: 'cash_returned_amount',
          width: 180,
          align: 'center',

          title: t('shifts.payment'),
        },
        {
          field: 'cash_received_amount',
          width: 180,
          align: 'center',

          title: t('shifts.recharge'),
        },
      ],
    },
    {
      field: 'payment_third_party_revenue_amount',
      width: 180,
      align: 'center',
      title: t('shifts.mobile-money-rev'),
    },
    {
      field: 'payment_third_party_expenditure_amount',
      width: 180,
      align: 'center',
      title: t('shifts.mobile-money-exp'),
    },
    {
      field: 'opening_cash_amount',
      width: 180,
      align: 'center',
      title: t('shifts.opening-cash'),
    },
    {
      field: 'cash_returned_amount',
      width: 180,
      align: 'center',
      title: t('shifts.returned-cash'),
    },
    {
      field: 'closing_cash_amount',
      width: 180,
      align: 'center',
      title: t('shifts.closing-cash'),
    },
    // {
    //   field: 'status',
    //   width: 180,
    //   align: 'center',
    //   title: t('common.now-status'),
    // },
    {
      field: 'start_time',
      width: 180,
      align: 'center',
      title: t('shifts.start-time'),
    },
    {
      field: 'end_time',
      width: 180,
      align: 'center',
      title: t('shifts.end-time'),
    },
    {
      field: 'creator_name',
      width: 180,
      align: 'center',
      title: t('shifts.creator'),
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
        is_shift_settlement: true,
        keywords: '',
      });

      return {
        list: response.list || [],
        total: response?.total || 0,
      };
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      id: 'shifts',
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('shifts.keywords-placeholder'),
          },
        },
        date_range: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
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
