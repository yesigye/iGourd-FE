import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  CustomerLabelQueryPageVO,
  CustomerLabelPageModel,
  LabelType,
} from '@@/customer/types';

import {
  getCustomerLabelPageListApi,
  deleteCustomerLabelApi,
} from '@@/customer/apis';

export function useCustomerLabel() {
  const { t } = useI18n();
  const userStore = useUserStore();

  // 基础列定义
  const baseColumns = [
    {
      prop: 'label_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.labelName'),
    },
    {
      prop: 'label_code',
      width: 150,
      align: 'left',
      title: t('customer.labelCode'),
    },
    {
      prop: 'label_type',
      width: 120,
      align: 'center',
      title: t('customer.labelType'),
    },
    {
      prop: 'color',
      width: 100,
      align: 'center',
      title: t('customer.color'),
    },
    {
      prop: 'sort_order',
      width: 100,
      align: 'center',
      title: t('customer.sortOrder'),
    },
    {
      prop: 'customer_count',
      width: 120,
      align: 'center',
      title: t('customer.customerCount'),
    },
    {
      prop: 'status',
      width: 100,
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
  const queryParams = ref<CustomerLabelQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<CustomerLabelPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: CustomerLabelQueryPageVO) => {
      const response = await getCustomerLabelPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户标签
    remove: async (data: { label_id_list: number[]; merchant_id?: number }) => {
      return await deleteCustomerLabelApi(data);
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
        name: 'label_type',
        title: t('customer.labelType'),
        options: [
          { label: t('customer.labelType.category'), value: 'CATEGORY' },
          { label: t('customer.labelType.status'), value: 'STATUS' },
          { label: t('customer.labelType.level'), value: 'LEVEL' },
          { label: t('customer.labelType.behavior'), value: 'BEHAVIOR' },
          { label: t('customer.labelType.preference'), value: 'PREFERENCE' },
          { label: t('customer.labelType.other'), value: 'OTHER' },
        ],
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [LabelDrawer, { openDrawer: openLabelDrawer }] = useDrawer<{ type: string; id?: number }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      label_type: val.searchVal?.label_type || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: CustomerLabelPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openLabelDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditLabel = (row: CustomerLabelPageModel) => {
    openLabelDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: CustomerLabelPageModel) => {
    openLabelDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理批量删除
  const handleBatchDeleteLabel = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteCustomerLabelApi({
        merchant_id: userStore.merchantId,
        label_id_list: selectedRows.value.map(item => item.id),
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
    LabelDrawer,

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
    handleEditLabel,
    handleDetail,
    handleBatchDeleteLabel,
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
