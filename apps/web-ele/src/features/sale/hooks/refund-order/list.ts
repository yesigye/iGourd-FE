import type { SaleRefundOrderPageModel } from '@@/sale/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { getSaleRefundOrderPageListApi } from '@@/sale/apis';
import { SaleRefundOrderDrawer } from '@@/sale/components';

import { useCrud } from '#/hooks';

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

  // 服务函数
  const service = {
    query: async ({
      page_num,
      page_size,
    }: {
      page_num: number;
      page_size: number;
    }) => {
      const response = await getSaleRefundOrderPageListApi({
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
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'input',
          name: 'keywords',
          title: t('refund-order.search'),
          'x-component-props': {
            placeholder: t('refund-order.searchPlaceholder'),
          },
        },
      },
      connectedComponent: SaleRefundOrderDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
