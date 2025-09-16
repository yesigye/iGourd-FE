import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  TaxQueryParams,
  TaxSearchParams,
  TaxForm,
  TaxPageModel,
} from '@@/account/types';

import {
  getTaxPageListApi,
  deleteTaxApi,
} from '@@/account/apis';

export function useTax() {
  const { t } = useI18n();
  const userStore = useUserStore();

  // 基础列定义
  const baseColumns = [
    {
      prop: 'name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('account.taxName'),
    },
    {
      prop: 'tax_type',
      width: 160,
      align: 'left',
      title: t('account.taxType'),
    },
    {
      prop: 'calculation_type',
      width: 160,
      align: 'left',
      title: t('account.calculationType'),
    },
    {
      prop: 'percentage',
      width: 160,
      align: 'left',
      title: t('account.percentage'),
    },
    {
      prop: 'tax_amount',
      width: 160,
      align: 'left',
      title: t('account.taxAmount'),
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
  const queryParams = ref<TaxQueryParams>({
    page_num: 1,
    page_size: 10,
    keyword: '',
    name: '',
    merchant_id: userStore.merchantId,
  });

  // 搜索参数
  const searchParams = ref<TaxSearchParams>({
    keyword: '',
    name: '',
  });

  // 选中的 ID 列表
  const selectedIds = ref<number[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: TaxQueryParams) => {
      const response = await getTaxPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除税务
    remove: async (data: { tax_id_list: number[]; merchant_id?: number }) => {
      return await deleteTaxApi(data);
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
        title: t('account.please_enter_keywords'),
        placeholder: t('account.please_enter_keywords'),
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

  // 处理选择
  const handleSelect = (selectedRows: TaxPageModel[]) => {
    selectedIds.value = selectedRows.map(item => item.id);
  };

  // 处理添加
  const handleAdd = () => {
    openDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditTax = (row: TaxPageModel) => {
    openDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理批量删除
  const handleBatchDeleteTax = async () => {
    if (!selectedIds.value.length) return;

    try {
      await deleteTaxApi({
        merchant_id: userStore.merchantId,
        tax_id_list: selectedIds.value,
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
    handleEditTax,
    handleBatchDeleteTax,
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
