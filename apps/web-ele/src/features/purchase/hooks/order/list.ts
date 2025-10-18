import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deletePurchaseOrderApi,
  getPurchaseOrderPageListApi,
} from '@@/purchase/apis';
import { PurchaseOrderDrawer } from '@@/purchase/components';

import { useCrud } from '#/hooks';

export function usePurchaseOrder() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'purchase_order_no',
      minWidth: 180,
      align: 'left',
      fixed: 'left',
      title: t('order.purchase-order-no'),
    },
    {
      field: 'purchase_date',
      minWidth: 200,
      align: 'left',
      title: t('order.purchase-date'),
    },
    {
      field: 'vendor_name',
      minWidth: 200,
      align: 'left',
      title: t('order.vendor-name'),
    },
    {
      field: 'warehouse_name',
      minWidth: 150,
      align: 'center',
      title: t('order.warehouse'),
    },
    {
      field: 'status',
      minWidth: 150,
      align: 'center',

      title: t('common.now-status'),
      formatter({ cellValue }) {
        return t(`purchase.${cellValue}`);
      },
    },
    {
      field: 'total_amount',
      minWidth: 150,
      align: 'center',
      title: t('order.total-amount'),
    },
    {
      field: 'deposit_amount',
      minWidth: 150,
      align: 'center',
      title: t('purchase.deposit'),
    },
    {
      field: 'cumulative_deposit_amount',
      minWidth: 150,
      align: 'center',
      title: t('order.cumulative-deposit'),
    },
    {
      field: 'unpaid_amount',
      minWidth: 150,
      align: 'center',
      title: t('order.balance'),
    },
    {
      field: 'creator_name',
      minWidth: 150,
      align: 'center',
      title: t('purchase.creator'),
    },
    {
      field: 'create_time',
      minWidth: 150,
      align: 'center',
      title: t('order.creation-time'),
    },
    {
      field: 'review_status',
      minWidth: 180,
      align: 'center',
      fixed: 'right',
      title: t('purchase.reviewStatus'),
      cellRender: {
        name: 'ReviewStatus',
      },
      slots: { default: 'modal' },
    },
    {
      field: 'operation',
      minWidth: 280,
      fixed: 'right',
      title: t('common.operations'),
      slots: {
        default: 'operation',
      },
    },
  ];
  // 服务函数
  const service = {
    // 获取列表数据
    query: async (data: {
      date_range?: string[];
      page_num: number;
      page_size: number;
    }) => {
      const params = {
        ...data,
      };
      if (data.date_range && data.date_range.length > 0) {
        params.start_create_time = data.date_range[0];
        params.end_create_time = data.date_range[1];
      }
      return await getPurchaseOrderPageListApi(params);
    },
    // 删除订单
    remove: deletePurchaseOrderApi,
  };
  const searchFormSchema = {
    date_range: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
      'x-decorator-props': {
        style: { 'margin-bottom': '0' },
      },
      'x-component-props': {
        placeholder: t('order.search-placeholder'),
        type: 'datetimerange',
      },
    },
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-decorator-props': {
        style: { 'margin-bottom': '0' },
      },
      'x-component-props': {
        placeholder: t('order.search-placeholder'),
      },
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
    id: 'PurchaseOrderList',
    columns: baseColumns,
    searchFormSchema,
    printConfig: {
      sheetName: '打印出货单据',
    },
    toolbarConfig: {
      export: true,
      print: false,
      import: false,
    },
    batchOperate: true,
    connectedComponent: PurchaseOrderDrawer,
  });

  return {
    // 组件
    Grid,
    Drawer,
    gridApi,
    // 方法
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
