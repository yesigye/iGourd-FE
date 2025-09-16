import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  CurrencyQueryParams,
  CurrencySearchParams,
  CurrencyForm,
} from '@@/account/types';

import { getCurrencyPageListApi, deleteCurrencyApi } from '@@/account/apis';

export function useCurrency() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('account.currencySymbol'),
    },
    {
      prop: 'code',
      width: 160,
      align: 'left',
      title: t('account.currencyCode'),
    },
    {
      prop: 'exchange_rate',
      width: 160,
      align: 'left',
      title: t('account.exchangeRate'),
    },
    {
      prop: 'symbol',
      width: 160,
      align: 'center',
      title: t('account.symbol'),
    },
  ];
  // 查询参数
  const queryParams = ref<CurrencyQueryParams>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 搜索参数
  const searchParams = ref<CurrencySearchParams>({
    keywords: '',
  });

  // 选中的 ID 列表
  const selectedIds = ref<number[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: CurrencyQueryParams) => {
      const response = await getCurrencyPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除货币
    remove: async (data: {
      currency_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteCurrencyApi(data);
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
        title: t('account.pleaseEnterKeywordsToSearchSelect'),
        placeholder: t('account.pleaseEnterKeywordsToSearchSelect'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [Drawer, { openDrawer }] = useDrawer<{ type: string; id?: number }>();

  // 处理搜索
  const handleSearch = (keywords: string) => {
    queryParams.value = {
      ...queryParams.value,
      keywords,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelect = (selectedRows: any[]) => {
    selectedIds.value = selectedRows.map((item) => item.id);
  };

  // 处理添加
  const handleAdd = () => {
    openDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditCurrency = (row: any) => {
    openDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理批量删除
  const handleBatchDeleteCurrency = async () => {
    if (!selectedIds.value.length) return;

    try {
      await deleteCurrencyApi({
        merchant_id: userStore.merchantId,
        currency_id_list: selectedIds.value,
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
    handleSelect,
    handleAdd,
    handleEditCurrency,
    handleBatchDeleteCurrency,
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
