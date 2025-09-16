import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  CustomerAccountQueryPageVO,
  CustomerAccountPageModel,
  AccountType,
} from '@@/customer/types';

import {
  getCustomerAccountPageListApi,
  deleteCustomerAccountApi,
  addCustomerRevenueApi,
  addCustomerExpenditureApi,
} from '@@/customer/apis';

export function useCustomerAccount() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'customer_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('customers.customerName'),
    },
    {
      prop: 'phone_no',
      width: 200,
      align: 'left',
      title: t('customers.phoneNumber'),
    },
    {
      prop: 'type',
      width: 200,
      align: 'left',
      title: t('customers.accountType'),
    },
    {
      prop: 'revenue',
      width: 200,
      align: 'left',
      title: t('customers.revenue'),
    },
    {
      prop: 'expenditures',
      width: 200,
      align: 'left',
      title: t('customers.expenditures'),
    },
    {
      prop: 'date',
      width: 200,
      align: 'left',
      title: t('customers.accountDate'),
    },
    {
      prop: 'remark',
      width: 100,
      align: 'left',
      title: t('customers.remark'),
    },
    {
      prop: 'transaction_number',
      width: 200,
      align: 'left',
      title: t('customers.transactionNumber'),
    },
    {
      prop: 'balance',
      width: 100,
      align: 'left',
      title: t('customers.balance'),
    },
    {
      prop: 'creator',
      width: 100,
      align: 'left',
      title: t('customers.creator'),
    },
    {
      prop: 'create_time',
      width: 200,
      align: 'center',
      fixed: 'right',
      title: t('customers.creationTime'),
    },
  ];
  // 查询参数
  const queryParams = ref<CustomerAccountQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<CustomerAccountPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: CustomerAccountQueryPageVO) => {
      const response = await getCustomerAccountPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除客户账户
    remove: async (data: {
      account_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteCustomerAccountApi(data);
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
        title: t('customers.search'),
        placeholder: t('customers.search'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [RevenueDrawer, { openDrawer: openRevenueDrawer }] = useDrawer<{
    type: AccountType;
  }>();
  const [ExpenditureDrawer, { openDrawer: openExpenditureDrawer }] = useDrawer<{
    type: AccountType;
  }>();
  const [ImportDrawer, { openDrawer: openImportDrawer }] = useDrawer();

  // 处理搜索
  const handleSearch = (keywords: string) => {
    queryParams.value = {
      ...queryParams.value,
      keywords,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: CustomerAccountPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加收入
  const handleAddRevenue = () => {
    openRevenueDrawer(true, { type: 'REVENUE' });
  };

  // 处理添加支出
  const handleAddExpenditure = () => {
    openExpenditureDrawer(true, { type: 'EXPENDITURE' });
  };

  // 处理导入
  const handleImport = () => {
    openImportDrawer(true);
  };

  // 处理批量删除
  const handleBatchDeleteAccount = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteCustomerAccountApi({
        merchant_id: userStore.merchantId,
        account_id_list: selectedRows.value.map((item) => item.id),
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
    RevenueDrawer,
    ExpenditureDrawer,
    ImportDrawer,

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
    handleAddRevenue,
    handleAddExpenditure,
    handleImport,
    handleBatchDeleteAccount,
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
