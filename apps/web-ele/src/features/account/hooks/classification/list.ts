import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';
import { debounce } from '@igourd/utils';
import { toRaw } from 'vue';

import type {
  ClassificationQueryParams,
  ClassificationSearchParams,
  FinanceCategoryDrawer,
  ColumnType,
} from '@@/account/types';

import {
  getFinanceCategoryListApi,
  deleteFinanceCategoryApi,
} from '@@/account/apis';

export function useClassification() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'name',
      width: 180,
      title: t('account.classification'),
      filterAble: true,
    },
    {
      prop: 'type',
      width: 170,
      title: t('account.revenue_and_expenditure'),
    },
    {
      prop: 'ledger_names',
      width: 180,
      title: t('account.classification_form.debit'),
    },
    {
      prop: 'target_ledger_name',
      width: 200,
      title: t('account.classification_form.credit'),
    },
    {
      prop: 'remark',
      width: 300,
      title: t('account.remark'),
    },
    {
      prop: 'creator_name',
      width: 200,
      title: t('account.creatorName'),
      filterAble: true,
    },
    {
      prop: 'create_time',
      width: 120,
      title: t('account.createTime'),
    },
  ];
  // 查询参数
  const queryParams = ref<ClassificationQueryParams>({
    page_num: 1,
    page_size: 10,
    type: 'ALL' as ColumnType,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 搜索参数
  const searchParams = ref<ClassificationSearchParams>({
    keywords: '',
  });

  // 选中的 ID 列表
  const selectedIds = ref<(number | string)[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: ClassificationQueryParams) => {
      const response = await getFinanceCategoryListApi({
        ...params,
        type: params.type === 'ALL' ? '' : params.type,
        create_id_list: params.create_id_list || [],
      });
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除财务分类
    remove: async (data: {
      finance_category_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteFinanceCategoryApi(data);
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
        title: t('account.enter_financial_classification'),
        placeholder: t('account.enter_financial_classification'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [Drawer, { openDrawer }] = useDrawer<FinanceCategoryDrawer>();

  // 处理搜索
  const handleSearch = debounce((searchVal: any) => {
    const type = searchVal.searchVal.tabKey;

    queryParams.value = {
      ...queryParams.value,
      id_list: toRaw(searchVal.cellSearch.name) ?? [],
      create_id_list: toRaw(searchVal.cellSearch.create_id_list) ?? [],
      page_num: 1,
      keywords: searchVal.searchVal.keywords,
      type: type,
    };
  }, 500);

  // 处理选择
  const handleSelect = (val: { id: string }[]) => {
    selectedIds.value = val.map((item) => item.id);
  };

  // 处理添加
  const handleAdd = () => {
    openDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditClassification = (row: any) => {
    openDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理批量删除
  const handleBatchDeleteClassification = async () => {
    if (!selectedIds.value.length) return;

    try {
      await deleteFinanceCategoryApi({
        merchant_id: userStore.merchantId,
        finance_category_id_list: selectedIds.value as number[],
      });
      refresh();
      selectedIds.value = [];
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  // 页码改变
  const handleCurrentChange = (val: number, size: number) => {
    if (
      val !== queryParams.value.page_num ||
      size !== queryParams.value.page_size
    ) {
      queryParams.value = {
        ...queryParams.value,
        page_num: val,
        page_size: size,
      };
    }
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
    handleEditClassification,
    handleBatchDeleteClassification,
    handleCurrentChange,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,

    // API
    gridApi,
  };
}
