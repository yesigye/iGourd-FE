import type { ReceiptOrderPageModel } from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getReceiptOrderPageListApi,
  createReceiptOrderApi,
  modifyReceiptOrderApi,
  removeReceiptOrderApi,
  getReceiptOrderDetailApi,
} from '@@/account/apis';
import { CollectionVoucherDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useCollectionVoucher() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<ReceiptOrderPageModel>[] = [
    {
      field: 'receipt_order_no',
      minWidth: 190,
      title: t('account.receipt_order_no'),
      sortable: true,
    },
    {
      field: 'customer_name',
      minWidth: 190,
      title: t('printTemp.printReceipt.receipt_customer_name'),
      sortable: true,
    },
    {
      field: 'receipt_time',
      minWidth: 170,
      title: t('account.orderDate'),
      align: 'right',
      sortable: true,
    },
    {
      field: 'total_amount',
      minWidth: 150,
      title: t('account.collected_amt'),
      sortable: true,
      align: 'right',
      formatter: 'formatMoney',
    },
    {
      field: 'receipt_direction',
      minWidth: 140,
      title: t('account.order_dir'),
      sortable: true,
      formatter({ cellValue }) {
        return t(
          `collection-voucher.receipt_direction.${cellValue.toLocaleLowerCase()}`,
        );
      },
    },
    {
      field: 'business_type',
      minWidth: 140,
      title: t('account.businessType'),
      sortable: true,
      formatter({ cellValue }) {
        return t(
          `collection-voucher.business_type.${cellValue.toLocaleLowerCase()}`,
        );
      },
    },
    {
      field: 'ledger_type',
      minWidth: 130,
      title: t('account.account-type'),
      sortable: true,
      formatter({ cellValue }) {
        return t(
          `collection-voucher.ledger_type_enum.${cellValue.toLocaleLowerCase()}`,
        );
      },
    },
    {
      field: 'remark',
      minWidth: 150,
      title: t('account.remarks'),
      sortable: true,
    },
    {
      field: 'review_time',
      minWidth: 170,
      title: t('account.review-time'),
      align: 'right',
      sortable: true,
    },
    {
      field: 'reviewer_name',
      minWidth: 110,
      title: t('account.reviewer'),
      sortable: true,
    },
    {
      field: 'review_status',
      minWidth: 130,
      title: t('common.review'),
      sortable: true,
      fixed: 'right',
      formatter({ cellValue }) {
        return t(`common.review-status.${cellValue}`);
      },
    },
    {
      field: 'actions',
      fixed: 'right',
      title: t('common.action'),
      minWidth: 100,
      slots: {
        default: 'operation',
      },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getReceiptOrderPageListApi,
    create: createReceiptOrderApi,
    update: modifyReceiptOrderApi,
    detail: getReceiptOrderDetailApi,
    // 删除收款单
    remove: async (data: { receipt_order_ids: number[] }) => {
      return await removeReceiptOrderApi(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      id: 'collection-voucher',
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
