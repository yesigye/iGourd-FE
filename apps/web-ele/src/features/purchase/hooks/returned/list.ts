import type { PurchaseReturnedPageModel } from '@@/purchase/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deletePurchaseReturnedApi,
  getPurchaseReturnedPageListApi,
} from '@@/purchase/apis';
import { PurchaseReturnedDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function usePurchaseReturned() {
  const { t } = useI18n();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<PurchaseReturnedPageModel>[] = [
    {
      field: 'purchase_returned_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('returned.purchase-returned-no'),
    },
    {
      field: 'returned_date',
      width: 150,
      align: 'left',
      title: t('returned.returned-date'),
    },
    {
      field: 'vendor_name',
      width: 180,
      align: 'center',
      title: t('returned.vendor-name'),
    },
    {
      field: 'warehouse_name',
      width: 180,
      align: 'center',
      title: t('returned.warehouse'),
    },
    {
      field: 'total_amount',
      width: 180,
      align: 'center',
      title: t('returned.refund-amount'),
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
      fixed: 'right',
      title: t('common.creation-time'),
    },
    {
      field: 'review_status',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('common.review'),
      cellRender: {
        name: 'review',
      },
    },
    {
      field: 'options',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('common.operations'),
      slots: { default: 'operation' },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getPurchaseReturnedPageListApi,
    // 删除退货单
    remove: async (data: { returned_id_list: number[] }) => {
      return await deletePurchaseReturnedApi(data);
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
            placeholder: t('common.keywords'),
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: PurchaseReturnedDrawer,
    });

  return {
    // 组件
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
