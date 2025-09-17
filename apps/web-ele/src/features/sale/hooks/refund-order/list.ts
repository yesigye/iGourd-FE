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
      field: 'refund_order_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('sale.refundOrderNo'),
    },
    {
      field: 'original_order_no',
      width: 180,
      align: 'left',
      title: t('sale.originalOrderNo'),
    },
    {
      field: 'customer_name',
      width: 150,
      align: 'left',
      title: t('sale.customerName'),
    },
    {
      field: 'staff_name',
      width: 120,
      align: 'left',
      title: t('sale.staffName'),
    },
    {
      field: 'refund_method',
      width: 120,
      align: 'center',
      title: t('sale.refundMethod'),
    },
    {
      field: 'status',
      width: 120,
      align: 'center',
      title: t('sale.status'),
    },
    {
      field: 'refund_reason',
      width: 200,
      align: 'left',
      title: t('sale.refundReason'),
    },
    {
      field: 'refund_date',
      width: 150,
      align: 'center',
      title: t('sale.refundDate'),
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
      const response = await getSaleRefundOrderPageListApi({
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
        data: response.data?.list || [],
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
          type: 'input',
          name: 'keywords',
          title: t('sale.search'),
          'x-component-props': {
            placeholder: t('sale.searchPlaceholder'),
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
