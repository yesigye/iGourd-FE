import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  CustomerEquityQueryPageVO,
  CustomerEquityPageModel,
  EquityType,
} from '@@/customer/types';

import {
  getCustomerEquityPageListApi,
  deleteCustomerEquityApi,
} from '@@/customer/apis';

export function useCustomerEquity() {
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
      prop: 'equity_type',
      width: 150,
      align: 'center',
      title: t('customer.equityType'),
    },
    {
      prop: 'equity_value',
      width: 120,
      align: 'right',
      title: t('customer.equityValue'),
    },
    {
      prop: 'equity_unit',
      width: 100,
      align: 'center',
      title: t('customer.equityUnit'),
    },
    {
      prop: 'description',
      width: 250,
      align: 'left',
      title: t('customer.description'),
    },
    {
      prop: 'granted_date',
      width: 150,
      align: 'center',
      title: t('customer.grantedDate'),
    },
    {
      prop: 'expiry_date',
      width: 150,
      align: 'center',
      title: t('customer.expiryDate'),
    },
    {
      prop: 'status',
      width: 120,
      align: 'center',
      title: t('customer.status'),
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
  const queryParams = ref<CustomerEquityQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<CustomerEquityPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: CustomerEquityQueryPageVO) => {
      const response = await getCustomerEquityPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户股权
    remove: async (data: {
      equity_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteCustomerEquityApi(data);
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
        name: 'equity_type',
        title: t('customer.equityType'),
        options: [
          { label: t('customer.equityType.vipLevel'), value: 'VIP_LEVEL' },
          { label: t('customer.equityType.discount'), value: 'DISCOUNT' },
          { label: t('customer.equityType.point'), value: 'POINT' },
          { label: t('customer.equityType.cashback'), value: 'CASHBACK' },
          { label: t('customer.equityType.gift'), value: 'GIFT' },
          { label: t('customer.equityType.other'), value: 'OTHER' },
        ],
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('customer.grantedDate'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [EquityDrawer, { openDrawer: openEquityDrawer }] = useDrawer<{
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
      equity_type: val.searchVal?.equity_type || undefined,
      start_date: val.searchVal?.dateRange?.[0] || undefined,
      end_date: val.searchVal?.dateRange?.[1] || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: CustomerEquityPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openEquityDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditEquity = (row: CustomerEquityPageModel) => {
    openEquityDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: CustomerEquityPageModel) => {
    openEquityDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理设置
  const handleSetting = () => {
    openSettingDrawer(true, { type: 'setting' });
  };

  // 处理批量删除
  const handleBatchDeleteEquity = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteCustomerEquityApi({
        merchant_id: userStore.merchantId,
        equity_id_list: selectedRows.value.map((item) => item.id),
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
    EquityDrawer,
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
    handleEditEquity,
    handleDetail,
    handleSetting,
    handleBatchDeleteEquity,
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
