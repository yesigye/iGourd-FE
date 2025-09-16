import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  SettingStoresetQueryPageVO,
  SettingStoresetPageModel,
  StoresetStatus,
  StoreBasicInfo,
} from '@@/setting/types';

import {
  getSettingStoresetPageListApi,
  deleteSettingStoresetApi,
  updateStoresetStatusApi,
  getStoreBasicInfoApi,
  updateStoreBasicInfoApi,
} from '@@/setting/apis';

export function useSettingStoreset() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'setting_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('setting.settingName'),
    },
    {
      prop: 'setting_key',
      width: 150,
      align: 'left',
      title: t('setting.settingKey'),
    },
    {
      prop: 'setting_value',
      width: 200,
      align: 'left',
      title: t('setting.settingValue'),
    },
    {
      prop: 'setting_type',
      width: 120,
      align: 'center',
      title: t('setting.settingType'),
    },
    {
      prop: 'status',
      width: 100,
      align: 'center',
      title: t('setting.status'),
    },
    {
      prop: 'group_name',
      width: 150,
      align: 'left',
      title: t('setting.groupName'),
    },
    {
      prop: 'description',
      width: 200,
      align: 'left',
      title: t('setting.description'),
    },
    {
      prop: 'sort_order',
      width: 100,
      align: 'center',
      title: t('setting.sortOrder'),
    },
    {
      prop: 'creator_name',
      width: 120,
      align: 'left',
      title: t('setting.creatorName'),
    },
    {
      prop: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('setting.createTime'),
    },
  ];
  // 查询参数
  const queryParams = ref<SettingStoresetQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<SettingStoresetPageModel[]>([]);

  // 店铺基本信息
  const storeBasicInfo = ref<StoreBasicInfo>({
    package_name: '',
    merchant_business_type: '',
    package_start_time: '',
    package_expiration_time: '',
    create_time: '',
    store_name: '',
    store_code: '',
    store_type: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    logo_url: '',
    banner_url: '',
    business_hours: '',
    timezone: '',
    currency: '',
    language: '',
    tax_rate: 0,
    shipping_fee: 0,
    free_shipping_threshold: 0,
    return_policy: '',
    refund_policy: '',
    privacy_policy: '',
    terms_of_service: '',
  });

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: SettingStoresetQueryPageVO) => {
      const response = await getSettingStoresetPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除店铺设置
    remove: async (data: {
      storeset_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteSettingStoresetApi(data);
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
        title: t('setting.search'),
        placeholder: t('setting.searchPlaceholder'),
      },
      {
        type: 'select',
        name: 'status',
        title: t('setting.status'),
        options: [
          { label: t('setting.status.active'), value: 'ACTIVE' },
          { label: t('setting.status.inactive'), value: 'INACTIVE' },
        ],
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [StoresetDrawer, { openDrawer: openStoresetDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: SettingStoresetPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openStoresetDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditStoreset = (row: SettingStoresetPageModel) => {
    openStoresetDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: SettingStoresetPageModel) => {
    openStoresetDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理状态切换
  const handleToggleStatus = async (row: SettingStoresetPageModel) => {
    try {
      const newStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateStoresetStatusApi({
        storeset_id: row.id,
        status: newStatus,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('切换状态失败:', error);
    }
  };

  // 加载店铺基本信息
  const loadStoreBasicInfo = async () => {
    try {
      const response = await getStoreBasicInfoApi({
        merchant_id: userStore.merchantId,
      });
      storeBasicInfo.value = response.data;
    } catch (error) {
      console.error('加载店铺基本信息失败:', error);
    }
  };

  // 更新店铺基本信息
  const updateStoreBasicInfo = async (data: Partial<StoreBasicInfo>) => {
    try {
      await updateStoreBasicInfoApi({
        ...data,
        merchant_id: userStore.merchantId,
      });
      await loadStoreBasicInfo();
    } catch (error) {
      console.error('更新店铺基本信息失败:', error);
    }
  };

  // 处理批量删除
  const handleBatchDeleteStoreset = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteSettingStoresetApi({
        merchant_id: userStore.merchantId,
        storeset_id_list: selectedRows.value.map((item) => item.id),
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
    StoresetDrawer,

    // 数据
    queryParams,
    selectedRows,
    storeBasicInfo,

    // 配置
    columns: baseColumns,

    // 方法
    handleEdit,
    handleDelete,
    handleSearch,
    handleSelectionChange,
    handleAdd,
    handleEditStoreset,
    handleDetail,
    handleToggleStatus,
    loadStoreBasicInfo,
    updateStoreBasicInfo,
    handleBatchDeleteStoreset,
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
