import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  CustomerIntegralQueryPageVO,
  CustomerIntegralPageModel,
  IntegralType,
  IntegralStatus,
} from '@@/customer/types';

import {
  getCustomerIntegralPageListApi,
  deleteCustomerIntegralApi,
} from '@@/customer/apis';

export function useCustomerIntegral() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'customer_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.customerName'),
    },
    {
      prop: 'integral_type',
      width: 120,
      align: 'center',
      title: t('customer.integralType'),
    },
    {
      prop: 'points',
      width: 120,
      align: 'right',
      title: t('customer.points'),
    },
    {
      prop: 'status',
      width: 120,
      align: 'center',
      title: t('customer.status'),
    },
    {
      prop: 'description',
      width: 200,
      align: 'left',
      title: t('customer.description'),
    },
    {
      prop: 'earn_date',
      width: 150,
      align: 'center',
      title: t('customer.earnDate'),
    },
    {
      prop: 'expire_date',
      width: 150,
      align: 'center',
      title: t('customer.expireDate'),
    },
    {
      prop: 'creator_name',
      width: 120,
      align: 'left',
      title: t('customer.creatorName'),
    },
    {
      prop: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('customer.createTime'),
    },
  ];
  // 查询参数
  const queryParams = ref<CustomerIntegralQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<CustomerIntegralPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: CustomerIntegralQueryPageVO) => {
      const response = await getCustomerIntegralPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户积分
    remove: async (data: {
      integral_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteCustomerIntegralApi(data);
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
        title: t('customer.search'),
        placeholder: t('customer.searchPlaceholder'),
      },
      {
        type: 'select',
        name: 'integral_type',
        title: t('customer.integralType'),
        options: [
          { label: t('customer.integralType.earn'), value: 'EARN' },
          { label: t('customer.integralType.spend'), value: 'SPEND' },
          { label: t('customer.integralType.expire'), value: 'EXPIRE' },
          { label: t('customer.integralType.adjust'), value: 'ADJUST' },
          { label: t('customer.integralType.refund'), value: 'REFUND' },
        ],
      },
      {
        type: 'select',
        name: 'status',
        title: t('customer.status'),
        options: [
          { label: t('customer.status.active'), value: 'ACTIVE' },
          { label: t('customer.status.expired'), value: 'EXPIRED' },
          { label: t('customer.status.used'), value: 'USED' },
          { label: t('customer.status.cancelled'), value: 'CANCELLED' },
        ],
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('customer.earnDate'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [IntegralDrawer, { openDrawer: openIntegralDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();
  const [SettingDrawer, { openDrawer: openSettingDrawer }] = useDrawer<{
    type: string;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      integral_type: val.searchVal?.integral_type || undefined,
      status: val.searchVal?.status || undefined,
      start_date: val.searchVal?.dateRange?.[0] || undefined,
      end_date: val.searchVal?.dateRange?.[1] || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: CustomerIntegralPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openIntegralDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditIntegral = (row: CustomerIntegralPageModel) => {
    openIntegralDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: CustomerIntegralPageModel) => {
    openIntegralDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理设置
  const handleSetting = () => {
    openSettingDrawer(true, { type: 'setting' });
  };

  // 处理批量删除
  const handleBatchDeleteIntegral = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteCustomerIntegralApi({
        merchant_id: userStore.merchantId,
        integral_id_list: selectedRows.value.map((item) => item.id),
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
    IntegralDrawer,
    SettingDrawer,

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
    handleEditIntegral,
    handleDetail,
    handleSetting,
    handleBatchDeleteIntegral,
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
