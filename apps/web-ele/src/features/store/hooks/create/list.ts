import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  StoreCreateQueryPageVO,
  StoreCreatePageModel,
  StoreCreateStatus,
  StoreCreateStep,
} from '@@igourd/stores/types';

import {
  getStoreCreatePageListApi,
  deleteStoreCreateApi,
  submitStoreCreateApi,
} from '@@igourd/stores/apis';

export function useStoreCreate() {
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
      prop: 'status',
      width: 120,
      align: 'center',
      title: t('store.status'),
    },
    {
      prop: 'current_step',
      width: 150,
      align: 'center',
      title: t('store.currentStep'),
    },
    {
      prop: 'progress',
      width: 120,
      align: 'center',
      title: t('store.progress'),
    },
    {
      prop: 'create_date',
      width: 150,
      align: 'center',
      title: t('store.createDate'),
    },
    {
      prop: 'submit_date',
      width: 150,
      align: 'center',
      title: t('store.submitDate'),
    },
    {
      prop: 'approve_date',
      width: 150,
      align: 'center',
      title: t('store.approveDate'),
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
  const queryParams = ref<StoreCreateQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<StoreCreatePageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: StoreCreateQueryPageVO) => {
      const response = await getStoreCreatePageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除店铺创建
    remove: async (data: {
      create_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteStoreCreateApi(data);
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
          { label: t('store.status.draft'), value: 'DRAFT' },
          { label: t('store.status.submitted'), value: 'SUBMITTED' },
          { label: t('store.status.reviewing'), value: 'REVIEWING' },
          { label: t('store.status.approved'), value: 'APPROVED' },
          { label: t('store.status.rejected'), value: 'REJECTED' },
          { label: t('store.status.completed'), value: 'COMPLETED' },
        ],
      },
      {
        type: 'select',
        name: 'step',
        title: t('store.currentStep'),
        options: [
          { label: t('store.step.basicInfo'), value: 'BASIC_INFO' },
          { label: t('store.step.edition'), value: 'EDITION' },
          { label: t('store.step.package'), value: 'PACKAGE' },
          { label: t('store.step.payment'), value: 'PAYMENT' },
          { label: t('store.step.complete'), value: 'COMPLETE' },
        ],
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('store.createDate'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [StoreCreateDrawer, { openDrawer: openStoreCreateDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      step: val.searchVal?.step || undefined,
      start_date: val.searchVal?.dateRange?.[0] || undefined,
      end_date: val.searchVal?.dateRange?.[1] || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: StoreCreatePageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openStoreCreateDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditStoreCreate = (row: StoreCreatePageModel) => {
    openStoreCreateDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: StoreCreatePageModel) => {
    openStoreCreateDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理提交申请
  const handleSubmit = async (row: StoreCreatePageModel) => {
    try {
      await submitStoreCreateApi({
        create_id: row.id,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('提交申请失败:', error);
    }
  };

  // 处理继续创建
  const handleContinue = (row: StoreCreatePageModel) => {
    // 这里可以跳转到创建流程的下一步
    console.log('继续创建:', row);
  };

  // 处理批量删除
  const handleBatchDeleteStoreCreate = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteStoreCreateApi({
        merchant_id: userStore.merchantId,
        create_id_list: selectedRows.value.map((item) => item.id),
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
    StoreCreateDrawer,

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
    handleEditStoreCreate,
    handleDetail,
    handleSubmit,
    handleContinue,
    handleBatchDeleteStoreCreate,
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
