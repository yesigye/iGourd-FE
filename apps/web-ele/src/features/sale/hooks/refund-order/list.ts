import type { SaleRefundOrderPageModel } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getSaleRefundOrderPageListApi } from '@@/sale/apis';
import { SaleRefundOrderDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';
import { defaultTime } from '#/utils/time';

export function useSaleRefundOrder() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<SaleRefundOrderPageModel>[] = [
    {
      field: 'order_returned_no',
      width: 180,
      align: 'center',
      title: t('refund-order.order-no'),
    },
    {
      field: 'customer_name',
      width: 180,
      align: 'center',
      title: t('refund-order.customer'),
    },
    {
      field: 'create_time',
      width: 150,
      align: 'center',
      title: t('refund-order.order-date'),
    },
    {
      field: 'total_quantity',
      width: 180,
      align: 'center',
      title: t('refund-order.refund-qty'),
    },
    {
      field: 'subtotal_amount',
      width: 180,
      align: 'center',
      title: t('refund-order.refund-product-value'),
    },
    {
      field: 'total_amount',
      width: 180,
      align: 'center',
      title: t('refund-order.actual-refund-amt'),
    },
    {
      field: 'promotion_discount_amount',
      width: 200,
      align: 'center',
      title: t('refund-order.refund-difference'),
    },
    {
      field: 'vat_amount',
      width: 200,
      align: 'center',
      title: t('refund-order.tax'),
    },
    {
      field: 'refund_date',
      width: 150,
      align: 'center',
      title: t('refund-order.refund-date'),
    },
    {
      field: 'status',
      width: 180,
      align: 'center',
      title: t('common.now-status'),
    },
    {
      field: 'creator_name',
      width: 180,
      align: 'center',

      title: t('common.creator'),
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',

      title: t('common.creation-time'),
    },
    {
      field: 'operation',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('common.operation'),
      slots: { default: 'operation' },
    },
  ];
  const searchFormSchema = {
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
        defaultTime,
      },
    },
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('order.order-no')}}",
        clearable: true,
      },
    },
  };
  // 服务函数
  const service = {
    query: async ({
      page_num,
      page_size,
      keywords,
      date_range,
    }: {
      date_range: string[];
      keywords?: string;
      page_num: number;
      page_size: number;
    }) => {
      const params = {};
      if (date_range && date_range.length > 0) {
        params.start_create_time = `${date_range[0]} 00:00:00`;
        params.end_create_time = `${date_range[1]} 23:59:59`;
      }
      const response = await getSaleRefundOrderPageListApi({
        page_num,
        page_size,
        keywords,
        ...params,
      });

      return {
        list: response.list || [],
        total: response?.total || 0,
      };
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    canBatchOperate,
    Drawer,
    handleEdit,
    handleBatchDelete,
  } = useCrud({
    service,
    id: 'refund-order',
    columns: baseColumns,
    searchFormSchema,
    connectedComponent: SaleRefundOrderDrawer,
  });

  return {
    Grid,
    gridApi,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
