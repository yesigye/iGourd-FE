import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  StoreDeviceQueryPageVO,
  StoreDevicePageModel,
  DeviceStatus,
  DeviceType,
} from '@@igourd/stores/types';

import {
  getStoreDevicePageListApi,
  deleteStoreDeviceApi,
  toggleDeviceStatusApi,
  restartDeviceApi,
} from '@@igourd/stores/apis';

export function useStoreDevice() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'device_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('store.deviceName'),
    },
    {
      prop: 'device_code',
      width: 150,
      align: 'left',
      title: t('store.deviceCode'),
    },
    {
      prop: 'device_type',
      width: 120,
      align: 'center',
      title: t('store.deviceType'),
    },
    {
      prop: 'status',
      width: 100,
      align: 'center',
      title: t('store.status'),
    },
    {
      prop: 'store_name',
      width: 150,
      align: 'left',
      title: t('store.storeName'),
    },
    {
      prop: 'ip_address',
      width: 150,
      align: 'left',
      title: t('store.ipAddress'),
    },
    {
      prop: 'mac_address',
      width: 150,
      align: 'left',
      title: t('store.macAddress'),
    },
    {
      prop: 'last_online_time',
      width: 180,
      align: 'center',
      title: t('store.lastOnlineTime'),
    },
    {
      prop: 'version',
      width: 120,
      align: 'center',
      title: t('store.version'),
    },
    {
      prop: 'location',
      width: 150,
      align: 'left',
      title: t('store.location'),
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
  const queryParams = ref<StoreDeviceQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<StoreDevicePageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: StoreDeviceQueryPageVO) => {
      const response = await getStoreDevicePageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除设备
    remove: async (data: {
      device_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteStoreDeviceApi(data);
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
          { label: t('store.status.online'), value: 'ONLINE' },
          { label: t('store.status.offline'), value: 'OFFLINE' },
          { label: t('store.status.maintenance'), value: 'MAINTENANCE' },
          { label: t('store.status.error'), value: 'ERROR' },
        ],
      },
      {
        type: 'select',
        name: 'device_type',
        title: t('store.deviceType'),
        options: [
          { label: t('store.deviceType.pos'), value: 'POS' },
          { label: t('store.deviceType.printer'), value: 'PRINTER' },
          { label: t('store.deviceType.scanner'), value: 'SCANNER' },
          { label: t('store.deviceType.display'), value: 'DISPLAY' },
          { label: t('store.deviceType.camera'), value: 'CAMERA' },
          { label: t('store.deviceType.other'), value: 'OTHER' },
        ],
      },
      {
        type: 'select',
        name: 'store_id',
        title: t('store.storeName'),
        options: [],
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [DeviceDrawer, { openDrawer: openDeviceDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      device_type: val.searchVal?.device_type || undefined,
      store_id: val.searchVal?.store_id || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: StoreDevicePageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openDeviceDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditDevice = (row: StoreDevicePageModel) => {
    openDeviceDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: StoreDevicePageModel) => {
    openDeviceDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理状态切换
  const handleToggleStatus = async (row: StoreDevicePageModel) => {
    try {
      const newStatus = row.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
      await toggleDeviceStatusApi({
        device_id: row.id,
        status: newStatus,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('切换状态失败:', error);
    }
  };

  // 处理重启设备
  const handleRestart = async (row: StoreDevicePageModel) => {
    try {
      await restartDeviceApi({
        device_id: row.id,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('重启设备失败:', error);
    }
  };

  // 处理批量删除
  const handleBatchDeleteDevice = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteStoreDeviceApi({
        merchant_id: userStore.merchantId,
        device_id_list: selectedRows.value.map((item) => item.id),
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
    DeviceDrawer,

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
    handleEditDevice,
    handleDetail,
    handleToggleStatus,
    handleRestart,
    handleBatchDeleteDevice,
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
