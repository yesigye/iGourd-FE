import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  SaleRefundOrderQueryPageVO,
  SaleRefundOrderPageModel,
  RefundOrderStatus,
  RefundMethod,
} from '@@/sale/types';

import {
  getSaleRefundOrderPageListApi,
  deleteSaleRefundOrderApi,
  cancelSaleRefundOrderApi,
  exportSaleRefundOrderApi,
} from '@@/sale/apis';

export function useSaleRefundOrder() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'refund_order_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('sale.refundOrderNo'),
    },
    {
      prop: 'original_order_no',
      width: 180,
      align: 'left',
      title: t('sale.originalOrderNo'),
    },
    {
      prop: 'customer_name',
      width: 150,
      align: 'left',
      title: t('sale.customerName'),
    },
    {
      prop: 'staff_name',
      width: 120,
      align: 'left',
      title: t('sale.staffName'),
    },
    {
      prop: 'refund_amount',
      width: 150,
      align: 'right',
      title: t('sale.refundAmount'),
    },
    {
      prop: 'refund_method',
      width: 120,
      align: 'center',
      title: t('sale.refundMethod'),
    },
    {
      prop: 'status',
      width: 120,
      align: 'center',
      title: t('sale.status'),
    },
    {
      prop: 'refund_reason',
      width: 200,
      align: 'left',
      title: t('sale.refundReason'),
    },
    {
      prop: 'refund_date',
      width: 150,
      align: 'center',
      title: t('sale.refundDate'),
    },
    {
      prop: 'creator_name',
      width: 120,
      align: 'left',
      title: t('sale.creatorName'),
    },
    {
      prop: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('sale.createTime'),
    },
  ];
  // 查询参数
  const queryParams = ref<SaleRefundOrderQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<SaleRefundOrderPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: SaleRefundOrderQueryPageVO) => {
      const response = await getSaleRefundOrderPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除退款订单
    remove: async (data: {
      refund_order_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteSaleRefundOrderApi(data);
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    handleEdit,
    handleDelete,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,
  } = useCrud({
    service,
    columns: baseColumns,
    searchFormSchema: [
      {
        type: 'input',
        name: 'keywords',
        title: t('sale.search'),
        placeholder: t('sale.searchPlaceholder'),
      },
      {
        type: 'select',
        name: 'status',
        title: t('sale.status'),
        options: [
          { label: t('sale.status.pending'), value: 'PENDING' },
          { label: t('sale.status.processing'), value: 'PROCESSING' },
          { label: t('sale.status.completed'), value: 'COMPLETED' },
          { label: t('sale.status.cancelled'), value: 'CANCELLED' },
          { label: t('sale.status.rejected'), value: 'REJECTED' },
        ],
      },
      {
        type: 'select',
        name: 'refund_method',
        title: t('sale.refundMethod'),
        options: [
          { label: t('sale.refundMethod.cash'), value: 'CASH' },
          { label: t('sale.refundMethod.card'), value: 'CARD' },
          { label: t('sale.refundMethod.transfer'), value: 'TRANSFER' },
          { label: t('sale.refundMethod.credit'), value: 'CREDIT' },
        ],
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('sale.refundDate'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [RefundOrderDrawer, { openDrawer: openRefundOrderDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      refund_method: val.searchVal?.refund_method || undefined,
      start_date: val.searchVal?.dateRange?.[0] || undefined,
      end_date: val.searchVal?.dateRange?.[1] || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: SaleRefundOrderPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openRefundOrderDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditRefundOrder = (row: SaleRefundOrderPageModel) => {
    openRefundOrderDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: SaleRefundOrderPageModel) => {
    openRefundOrderDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理取消退款
  const handleCancelRefund = async (row: SaleRefundOrderPageModel) => {
    try {
      await cancelSaleRefundOrderApi({
        refund_order_id: row.id,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('取消退款失败:', error);
    }
  };

  // 处理打印
  const handlePrint = (row: SaleRefundOrderPageModel) => {
    // 这里可以添加打印逻辑
    console.log('打印退款订单:', row);
  };

  // 处理导出
  const handleExport = async () => {
    try {
      const response = await exportSaleRefundOrderApi(queryParams.value);
      // 处理导出逻辑
      console.log('导出成功:', response);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  // 处理批量删除
  const handleBatchDeleteRefundOrder = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteSaleRefundOrderApi({
        merchant_id: userStore.merchantId,
        refund_order_id_list: selectedRows.value.map((item) => item.id),
      });
      refresh();
      selectedRows.value = [];
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  // 页码改变
  const handleCurrentChange = (val: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_num: val,
    };
  };

  // 页面大小改变
  const handleSizeChange = (val: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_size: val,
    };
  };

  return {
    // 组件
    Grid,
    RefundOrderDrawer,

    // 数据
    queryParams,
    selectedRows,

    // 配置
    columns: baseColumns,

    // 方法
    handleEdit,
    handleDelete,
    handleSearch,
    handleSelectionChange,
    handleAdd,
    handleEditRefundOrder,
    handleDetail,
    handleCancelRefund,
    handlePrint,
    handleExport,
    handleBatchDeleteRefundOrder,
    handleCurrentChange,
    handleSizeChange,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,

    // API
    gridApi,
  };
}
