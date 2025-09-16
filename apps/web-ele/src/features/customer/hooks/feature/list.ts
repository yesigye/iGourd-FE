import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  CustomerFeatureQueryPageVO,
  CustomerFeaturePageModel,
  FeatureType,
} from '@@/customer/types';

import {
  getCustomerFeaturePageListApi,
  deleteCustomerFeatureApi,
} from '@@/customer/apis';

export function useCustomerFeature() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'feature_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customer.featureName'),
    },
    {
      prop: 'feature_code',
      width: 150,
      align: 'left',
      title: t('customer.featureCode'),
    },
    {
      prop: 'feature_type',
      width: 120,
      align: 'center',
      title: t('customer.featureType'),
    },
    {
      prop: 'is_required',
      width: 100,
      align: 'center',
      title: t('customer.isRequired'),
    },
    {
      prop: 'is_searchable',
      width: 120,
      align: 'center',
      title: t('customer.isSearchable'),
    },
    {
      prop: 'sort_order',
      width: 100,
      align: 'center',
      title: t('customer.sortOrder'),
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
  const queryParams = ref<CustomerFeatureQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<CustomerFeaturePageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: CustomerFeatureQueryPageVO) => {
      const response = await getCustomerFeaturePageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户特征
    remove: async (data: {
      feature_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteCustomerFeatureApi(data);
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
        name: 'feature_type',
        title: t('customer.featureType'),
        options: [
          { label: t('customer.featureType.text'), value: 'TEXT' },
          { label: t('customer.featureType.number'), value: 'NUMBER' },
          { label: t('customer.featureType.date'), value: 'DATE' },
          { label: t('customer.featureType.select'), value: 'SELECT' },
          {
            label: t('customer.featureType.multiSelect'),
            value: 'MULTI_SELECT',
          },
          { label: t('customer.featureType.boolean'), value: 'BOOLEAN' },
          { label: t('customer.featureType.other'), value: 'OTHER' },
        ],
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [FeatureDrawer, { openDrawer: openFeatureDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      feature_type: val.searchVal?.feature_type || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: CustomerFeaturePageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openFeatureDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditFeature = (row: CustomerFeaturePageModel) => {
    openFeatureDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: CustomerFeaturePageModel) => {
    openFeatureDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理批量删除
  const handleBatchDeleteFeature = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteCustomerFeatureApi({
        merchant_id: userStore.merchantId,
        feature_id_list: selectedRows.value.map((item) => item.id),
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
    FeatureDrawer,

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
    handleEditFeature,
    handleDetail,
    handleBatchDeleteFeature,
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
