import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';
import { formatDate } from '#/utils';

import type {
  CurrencyExchangeQueryParams,
  CurrencyExchangeSearchParams,
  CurrencyExchangeForm,
} from '@@/account/types';

import {
  getCurrencyExchangePageListApi,
  deleteCurrencyExchangeApi,
} from '@@/account/apis';

export function useExchange() {
  const { t } = useI18n();
  const userStore = useUserStore();

  // 基础列定义
  const baseColumns = [
    {
      prop: 'sell_amount',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('account.sellAmount'),
    },
    {
      prop: 'buy_amount',
      width: 200,
      align: 'left',
      title: t('account.buyAmount'),
    },
    {
      prop: 'exchange_rate',
      width: 200,
      align: 'left',
      title: t('account.exchangeRate'),
    },
    {
      prop: 'remark',
      width: 180,
      align: 'left',
      title: t('account.remark'),
    },
    {
      prop: 'creator_name',
      width: 200,
      align: 'left',
      title: t('account.creatorName'),
    },
    {
      prop: 'create_time',
      width: 180,
      align: 'left',
      title: t('account.createTime'),
    },
  ];

  // 查询参数
  const queryParams = ref<CurrencyExchangeQueryParams>({
    page_num: 1,
    page_size: 10,
    keyword: '',
    merchant_id: userStore.merchantId,
  });

  // 搜索参数
  const searchParams = ref<CurrencyExchangeSearchParams>({
    keyword: '',
  });

  // 选中的 ID 列表
  const selectedIds = ref<number[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: CurrencyExchangeQueryParams) => {
      const response = await getCurrencyExchangePageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除货币兑换
    remove: async (data: { currency_exchange_id_list: number[]; merchant_id?: number }) => {
      return await deleteCurrencyExchangeApi(data);
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
        name: 'keyword',
        label: t('customers.search'),
        placeholder: t('customers.search'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [Drawer, { openDrawer }] = useDrawer<{ type: string; id?: number }>();

  // 处理搜索
  const handleSearch = (keyword: string) => {
    queryParams.value = {
      ...queryParams.value,
      keyword,
      page_num: 1,
    };
  };

  // 处理交易日期变化
  const handleTradeDateChange = (dateRange: any[]) => {
    queryParams.value = {
      ...queryParams.value,
      start_date: formatDate(dateRange[0]) + ' 00:00:00',
      end_date: formatDate(dateRange[1]) + ' 23:59:59',
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelect = (selectedRows: any[]) => {
    selectedIds.value = selectedRows.map(item => item.id);
  };

  // 处理添加
  const handleAdd = () => {
    openDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditExchange = (row: any) => {
    openDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理批量删除
  const handleBatchDeleteExchange = async () => {
    if (!selectedIds.value.length) return;

    try {
      await deleteCurrencyExchangeApi({
        merchant_id: userStore.merchantId,
        currency_exchange_id_list: selectedIds.value,
      });
      refresh();
      selectedIds.value = [];
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
    Drawer,

    // 数据
    queryParams,
    searchParams,
    selectedIds,

    // 配置
    columns: baseColumns,

    // 方法
    handleEdit,
    handleDelete,
    handleSearch,
    handleTradeDateChange,
    handleSelect,
    handleAdd,
    handleEditExchange,
    handleBatchDeleteExchange,
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
