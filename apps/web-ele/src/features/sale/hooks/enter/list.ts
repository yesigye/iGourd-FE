import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  SaleEnterQueryPageVO,
  SaleEnterPageModel,
  SaleEnterStatus,
} from '@@/sale/types';

import { getSaleEnterPageListApi, deleteSaleEnterApi } from '@@/sale/apis';

export function useSaleEnter() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'enter_no',
      width: 180,
      align: 'left',
      fixed: 'left',
      title: t('sale.enterNo'),
    },
    {
      prop: 'staff_name',
      width: 120,
      align: 'left',
      title: t('sale.staffName'),
    },
    {
      prop: 'customer_name',
      width: 150,
      align: 'left',
      title: t('sale.customerName'),
    },
    {
      prop: 'total_amount',
      width: 150,
      align: 'right',
      title: t('sale.totalAmount'),
    },
    {
      prop: 'paid_amount',
      width: 150,
      align: 'right',
      title: t('sale.paidAmount'),
    },
    {
      prop: 'status',
      width: 120,
      align: 'center',
      title: t('sale.status'),
    },
    {
      prop: 'enter_date',
      width: 150,
      align: 'center',
      title: t('sale.enterDate'),
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
  const queryParams = ref<SaleEnterQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<SaleEnterPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: SaleEnterQueryPageVO) => {
      const response = await getSaleEnterPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除销售录入
    remove: async (data: { enter_id_list: number[]; merchant_id?: number }) => {
      return await deleteSaleEnterApi(data);
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
          { label: t('sale.status.draft'), value: 'DRAFT' },
          { label: t('sale.status.confirmed'), value: 'CONFIRMED' },
          { label: t('sale.status.processing'), value: 'PROCESSING' },
          { label: t('sale.status.completed'), value: 'COMPLETED' },
          { label: t('sale.status.cancelled'), value: 'CANCELLED' },
        ],
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('sale.enterDate'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [EnterDrawer, { openDrawer: openEnterDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      start_date: val.searchVal?.dateRange?.[0] || undefined,
      end_date: val.searchVal?.dateRange?.[1] || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: SaleEnterPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openEnterDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditEnter = (row: SaleEnterPageModel) => {
    openEnterDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: SaleEnterPageModel) => {
    openEnterDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理批量删除
  const handleBatchDeleteEnter = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteSaleEnterApi({
        merchant_id: userStore.merchantId,
        enter_id_list: selectedRows.value.map((item) => item.id),
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
    EnterDrawer,

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
    handleEditEnter,
    handleDetail,
    handleBatchDeleteEnter,
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
