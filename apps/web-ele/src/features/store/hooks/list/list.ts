import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  StoreListQueryPageVO,
  StoreListPageModel,
  StoreStatus,
  StoreType,
} from '@@igourd/stores/types';

import {
  getStoreListPageListApi,
  deleteStoreListApi,
  toggleStoreStatusApi,
} from '@@igourd/stores/apis';

export function useStoreList() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'store_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('store.storeName'),
    },
    {
      prop: 'store_code',
      width: 150,
      align: 'left',
      title: t('store.storeCode'),
    },
    {
      prop: 'store_type',
      width: 120,
      align: 'center',
      title: t('store.storeType'),
    },
    {
      prop: 'status',
      width: 100,
      align: 'center',
      title: t('store.status'),
    },
    {
      prop: 'address',
      width: 250,
      align: 'left',
      title: t('store.address'),
    },
    {
      prop: 'city',
      width: 120,
      align: 'left',
      title: t('store.city'),
    },
    {
      prop: 'phone',
      width: 150,
      align: 'left',
      title: t('store.phone'),
    },
    {
      prop: 'manager_name',
      width: 120,
      align: 'left',
      title: t('store.managerName'),
    },
    {
      prop: 'open_date',
      width: 150,
      align: 'center',
      title: t('store.openDate'),
    },
    {
      prop: 'total_sales',
      width: 120,
      align: 'right',
      title: t('store.totalSales'),
    },
    {
      prop: 'total_orders',
      width: 100,
      align: 'center',
      title: t('store.totalOrders'),
    },
    {
      prop: 'creator_name',
      width: 120,
      align: 'left',
      title: t('store.creatorName'),
    },
    {
      prop: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('store.createTime'),
    },
  ];
  // 查询参数
  const queryParams = ref<StoreListQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<StoreListPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: StoreListQueryPageVO) => {
      const response = await getStoreListPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除店铺
    remove: async (data: { store_id_list: number[]; merchant_id?: number }) => {
      return await deleteStoreListApi(data);
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
        title: t('store.search'),
        placeholder: t('store.searchPlaceholder'),
      },
      {
        type: 'select',
        name: 'status',
        title: t('store.status'),
        options: [
          { label: t('store.status.active'), value: 'ACTIVE' },
          { label: t('store.status.inactive'), value: 'INACTIVE' },
          { label: t('store.status.maintenance'), value: 'MAINTENANCE' },
          { label: t('store.status.closed'), value: 'CLOSED' },
        ],
      },
      {
        type: 'select',
        name: 'store_type',
        title: t('store.storeType'),
        options: [
          { label: t('store.storeType.retail'), value: 'RETAIL' },
          { label: t('store.storeType.wholesale'), value: 'WHOLESALE' },
          { label: t('store.storeType.online'), value: 'ONLINE' },
          { label: t('store.storeType.hybrid'), value: 'HYBRID' },
        ],
      },
      {
        type: 'input',
        name: 'city',
        title: t('store.city'),
        placeholder: t('store.pleaseEnterCity'),
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('store.openDate'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [StoreListDrawer, { openDrawer: openStoreListDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      store_type: val.searchVal?.store_type || undefined,
      city: val.searchVal?.city || undefined,
      start_date: val.searchVal?.dateRange?.[0] || undefined,
      end_date: val.searchVal?.dateRange?.[1] || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: StoreListPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openStoreListDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditStore = (row: StoreListPageModel) => {
    openStoreListDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: StoreListPageModel) => {
    openStoreListDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理状态切换
  const handleToggleStatus = async (row: StoreListPageModel) => {
    try {
      const newStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await toggleStoreStatusApi({
        store_id: row.id,
        status: newStatus,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('切换状态失败:', error);
    }
  };

  // 处理批量删除
  const handleBatchDeleteStore = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteStoreListApi({
        merchant_id: userStore.merchantId,
        store_id_list: selectedRows.value.map((item) => item.id),
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
    StoreListDrawer,

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
    handleEditStore,
    handleDetail,
    handleToggleStatus,
    handleBatchDeleteStore,
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
