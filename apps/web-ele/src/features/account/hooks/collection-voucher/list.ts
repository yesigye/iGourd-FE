import type { ReceiptOrderPageModel } from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getReceiptOrderPageListApi,
  removeReceiptOrderApi,
} from '@@/account/apis';
import { CollectionVoucherDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useCollectionVoucher() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<ReceiptOrderPageModel>[] = [
    {
      field: 'receipt_order_no',
      width: 190,
      title: t('account.receipt_order_no'),
      sortable: true,
    },
    {
      field: 'customer_name',
      width: 190,
      title: t('printTemp.printReceipt.receipt_customer_name'),
      sortable: true,
    },
    {
      field: 'receipt_time',
      width: 170,
      title: t('account.orderDate'),
      sortable: true,
    },
    {
      field: 'total_amount',
      width: 150,
      title: t('account.collected_amt'),
      sortable: true,
    },
    {
      field: 'receipt_direction',
      width: 140,
      title: t('account.order_dir'),
      sortable: true,
    },
    {
      field: 'business_type',
      width: 140,
      title: t('account.businessType'),
      sortable: true,
    },
    {
      field: 'ledger_type',
      width: 130,
      title: t('account.accountType'),
      sortable: true,
    },
    {
      field: 'remark',
      width: 150,
      title: t('account.remarks'),
      sortable: true,
    },
    {
      field: 'review_time',
      width: 170,
      title: t('account.review_time'),
      sortable: true,
    },
    {
      field: 'reviewer_name',
      width: 110,
      title: t('account.reviewer'),
      sortable: true,
    },
    {
      field: 'review_status',
      width: 130,
      title: t('common.review'),
      sortable: true,
      fixed: 'right',
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getReceiptOrderPageListApi,

    // 删除收款单
    remove: async (data: { receipt_order_ids: number[] }) => {
      return await removeReceiptOrderApi(data);
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
            placeholder: t('account.enter_receipt_order_no'),
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: CollectionVoucherDrawer,
    });

  return {
    // 组件
    Grid,
    Drawer,
    // 数据
    handleEdit,
    handleBatchDelete,
    // 方法
    canBatchOperate,
  };
}
