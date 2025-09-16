import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  SaleShiftsQueryPageVO,
  SaleShiftsPageModel,
  ShiftStatus,
  ShiftType,
} from '@@/sale/types';

import {
  getSaleShiftsPageListApi,
  deleteSaleShiftsApi,
  exportSaleShiftsApi,
} from '@@/sale/apis';

export function useSaleShifts() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'shift_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('sale.shiftNo'),
    },
    {
      prop: 'staff_name',
      width: 120,
      align: 'left',
      title: t('sale.staffName'),
    },
    {
      prop: 'shift_type',
      width: 100,
      align: 'center',
      title: t('sale.shiftType'),
    },
    {
      prop: 'status',
      width: 100,
      align: 'center',
      title: t('sale.status'),
    },
    {
      prop: 'start_time',
      width: 150,
      align: 'center',
      title: t('sale.startTime'),
    },
    {
      prop: 'end_time',
      width: 150,
      align: 'center',
      title: t('sale.endTime'),
    },
    {
      prop: 'total_sales',
      width: 120,
      align: 'right',
      title: t('sale.totalSales'),
    },
    {
      prop: 'total_orders',
      width: 100,
      align: 'center',
      title: t('sale.totalOrders'),
    },
    {
      prop: 'cash_amount',
      width: 120,
      align: 'right',
      title: t('sale.cashAmount'),
    },
    {
      prop: 'card_amount',
      width: 120,
      align: 'right',
      title: t('sale.cardAmount'),
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
  const queryParams = ref<SaleShiftsQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<SaleShiftsPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: SaleShiftsQueryPageVO) => {
      const response = await getSaleShiftsPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除班次管理
    remove: async (data: { shift_id_list: number[]; merchant_id?: number }) => {
      return await deleteSaleShiftsApi(data);
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
          { label: t('sale.status.active'), value: 'ACTIVE' },
          { label: t('sale.status.completed'), value: 'COMPLETED' },
          { label: t('sale.status.cancelled'), value: 'CANCELLED' },
        ],
      },
      {
        type: 'select',
        name: 'shift_type',
        title: t('sale.shiftType'),
        options: [
          { label: t('sale.shiftType.morning'), value: 'MORNING' },
          { label: t('sale.shiftType.afternoon'), value: 'AFTERNOON' },
          { label: t('sale.shiftType.evening'), value: 'EVENING' },
          { label: t('sale.shiftType.night'), value: 'NIGHT' },
        ],
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('sale.shiftDate'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [ShiftsDrawer, { openDrawer: openShiftsDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      shift_type: val.searchVal?.shift_type || undefined,
      start_date: val.searchVal?.dateRange?.[0] || undefined,
      end_date: val.searchVal?.dateRange?.[1] || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: SaleShiftsPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openShiftsDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditShifts = (row: SaleShiftsPageModel) => {
    openShiftsDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: SaleShiftsPageModel) => {
    openShiftsDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理开始班次
  const handleStartShift = (row: SaleShiftsPageModel) => {
    // 这里可以添加开始班次的逻辑
    console.log('开始班次:', row);
  };

  // 处理结束班次
  const handleEndShift = (row: SaleShiftsPageModel) => {
    // 这里可以添加结束班次的逻辑
    console.log('结束班次:', row);
  };

  // 处理导出
  const handleExport = async () => {
    try {
      const response = await exportSaleShiftsApi(queryParams.value);
      // 处理导出逻辑
      console.log('导出成功:', response);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  // 处理批量删除
  const handleBatchDeleteShifts = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteSaleShiftsApi({
        merchant_id: userStore.merchantId,
        shift_id_list: selectedRows.value.map((item) => item.id),
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
    ShiftsDrawer,

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
    handleEditShifts,
    handleDetail,
    handleStartShift,
    handleEndShift,
    handleExport,
    handleBatchDeleteShifts,
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
