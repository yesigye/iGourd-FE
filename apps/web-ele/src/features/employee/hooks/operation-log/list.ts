import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';

import type {
  OperationLogQueryPageVO,
  OperationLogPageModel,
} from '@@/employee/types';

import { getOperationLogPageListApi } from '@@/employee/apis';

export function useOperationLog() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'operator_name',
      width: 206,
      align: 'left',
      title: t('employee.operatorName'),
    },
    {
      prop: 'account',
      width: 206,
      align: 'left',
      title: t('employee.account'),
    },
    {
      prop: 'operation_type',
      width: 206,
      align: 'left',
      title: t('employee.operationType'),
    },
    {
      prop: 'operation_description',
      width: 300,
      align: 'left',
      title: t('employee.operationDescription'),
    },
    {
      prop: 'ip_address',
      width: 150,
      align: 'left',
      title: t('employee.ipAddress'),
    },
    {
      prop: 'create_time',
      width: 206,
      align: 'left',
      title: t('employee.employee_create_time'),
    },
    {
      prop: 'status',
      width: 206,
      align: 'left',
      title: t('employee.employee_status'),
    },
  ];
  // 查询参数
  const queryParams = ref<OperationLogQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 搜索关键词
  const keywords = ref('');

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: OperationLogQueryPageVO) => {
      const response = await getOperationLogPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },
  };

  // 使用 CRUD Hook
  const { Grid, gridApi, refresh, loading } = useCrud({
    service,
    columns: baseColumns,
    searchFormSchema: [
      {
        type: 'input',
        name: 'keywords',
        title: t('employee.search'),
        placeholder: t('employee.pleaseOperationLog'),
      },
      {
        type: 'dateRange',
        name: 'dateRange',
        title: t('employee.operationTime'),
      },
    ],
    batchOperate: false, // 操作日志不需要批量操作
    connectedComponent: false,
  });

  // 处理搜索
  const handleSearch = (searchKeywords: string) => {
    keywords.value = searchKeywords;
    queryParams.value = {
      ...queryParams.value,
      keywords: searchKeywords,
      page_num: 1,
    };
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

    // 数据
    queryParams,
    keywords,

    // 配置
    columns: baseColumns,

    // 方法
    handleSearch,
    handleCurrentChange,
    handleSizeChange,
    refresh,
    loading,

    // API
    gridApi,
  };
}
