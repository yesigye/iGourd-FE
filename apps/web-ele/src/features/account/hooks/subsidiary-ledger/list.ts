import { ref, watch, watchEffect } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  SubsidiaryLedgerQueryParams,
  SubsidiaryLedgerSearchParams,
  SelectedTreeNode,
  TabType,
} from '@@/account/types';

import {
  getSubsidiaryLedgerPageListApi,
  listSubLedgerTreeApi,
} from '@@/account/apis';

export function useSubsidiaryLedger() {
  const { t } = useI18n();
  const userStore = useUserStore();

  // 基础列定义
  const baseColumns = [
    {
      prop: 'create_time',
      title: t('account.date'),
    },
    {
      prop: 'account_ledger',
      title: t('account.account'),
    },
    {
      prop: 'summary',
      title: t('account.summary'),
    },
    {
      prop: 'opposite_account_ledger',
      title: t('account.opposite_accounts'),
    },
    {
      prop: 'debit_amount',
      title: t('account.debit_amount'),
    },
    {
      prop: 'credit_amount',
      title: t('account.credit_amount'),
    },
    {
      prop: 'balance_direction',
      title: t('account.direction'),
    },
    {
      prop: 'amount',
      title: t('account.balance'),
    },
  ];

  // 当前选中的标签类型
  const selectedTabType = ref<TabType>('asset');

  // 搜索文本
  const filterText = ref('');

  // 选中的树节点
  const selectedTreeNode = ref<SelectedTreeNode>();

  // 期间范围
  const periodsRange = ref<string[]>();

  // 期间范围选择器可见性
  const periodsRangeVisible = ref(false);

  // 查询参数
  const queryParams = ref<SubsidiaryLedgerQueryParams>({
    page_num: 1,
    page_size: 10,
    account_set_id: userStore.merchantInfo.account_set_id,
    merchant_id: userStore.merchantId,
  });

  // 搜索参数
  const searchParams = ref<SubsidiaryLedgerSearchParams>({
    filterText: '',
    periodsRange: [],
    selectedTabType: 'asset',
  });

  // 树数据
  const treeData = ref([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: SubsidiaryLedgerQueryParams) => {
      const response = await getSubsidiaryLedgerPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
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
    searchFormSchema: [],
    batchOperate: false,
    connectedComponent: false,
  });

  // 抽屉管理
  const [Drawer, { openDrawer }] = useDrawer<{ type: string; data?: any }>();

  // 获取树数据
  const loadTreeData = async () => {
    try {
      const response = await listSubLedgerTreeApi({
        merchant_id: userStore.merchantId,
        // category: snakeCase(selectedTabType.value).toUpperCase(),
      });
      treeData.value = response.data?.[0] || [];
    } catch (error) {
      console.error('加载树数据失败:', error);
      treeData.value = [];
    }
  };

  // 处理树搜索
  const handleTreeSearch = () => {
    // 这里应该实现树搜索逻辑
    console.log('搜索树节点:', filterText.value);
  };

  // 处理树节点选择
  const handleTreeNodeSelect = (node: SelectedTreeNode) => {
    selectedTreeNode.value = node;
    queryParams.value.page_num = 1;
  };

  // 处理标签变化
  const handleTabChange = (tabType: TabType) => {
    selectedTabType.value = tabType;
    loadTreeData();
  };

  // 处理期间范围变化
  const handlePeriodsRangeChange = (dateRange: string[]) => {
    periodsRange.value = dateRange;
    periodsRangeVisible.value = false;
  };

  // 处理期间范围取消
  const handlePeriodsRangeCancel = () => {
    periodsRangeVisible.value = false;
  };

  // 页码改变
  const handlePageChange = (page: number, size: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_num: page,
      page_size: size,
    };
  };

  // 获取标签选项
  const getTabOptions = () => {
    return [
      {
        title: t('account.asset'),
        value: 'asset',
      },
      {
        title: t('account.liability'),
        value: 'liability',
      },
      {
        title: t('account.equity'),
        value: 'equity',
      },
      {
        title: t('account.profitAndLoss'),
        value: 'profitAndLoss',
      },
    ];
  };

  // 监听期间范围变化，自动设置默认值
  watchEffect(() => {
    if (!periodsRange.value && periods.value?.[0]?.period) {
      periodsRange.value = [periods.value[0].period, periods.value[0].period];
    }
  });

  // 监听树数据变化，自动选中第一个节点
  watch(treeData, (newTreeData) => {
    if (newTreeData?.[0]) {
      handleTreeNodeSelect(newTreeData[0]);
    }
  });

  // 监听标签变化，重新加载树数据
  watch(selectedTabType, () => {
    loadTreeData();
  });

  return {
    // 组件
    Grid,
    Drawer,

    // 数据
    selectedTabType,
    filterText,
    selectedTreeNode,
    periodsRange,
    periodsRangeVisible,
    treeData,
    queryParams,
    searchParams,

    // 配置
    columns: baseColumns,
    tabOptions: getTabOptions(),

    // 方法
    handleTreeSearch,
    handleTreeNodeSelect,
    handleTabChange,
    handlePeriodsRangeChange,
    handlePeriodsRangeCancel,
    handlePageChange,
    loadTreeData,
    handleEdit,
    handleDelete,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,

    // API
    gridApi,
  };
}
