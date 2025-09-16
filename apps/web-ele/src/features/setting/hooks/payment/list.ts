import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  SettingPaymentQueryPageVO,
  SettingPaymentPageModel,
  PaymentStatus,
  PaymentType,
  PaymentScene,
} from '@@/setting/types';

import {
  getSettingPaymentPageListApi,
  deleteSettingPaymentApi,
  togglePaymentStatusApi,
  updatePaymentSortApi,
} from '@@/setting/apis';

export function useSettingPayment() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'payment_method_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('setting.paymentMethodName'),
    },
    {
      prop: 'payment_type',
      width: 120,
      align: 'center',
      title: t('setting.paymentType'),
    },
    {
      prop: 'status',
      width: 100,
      align: 'center',
      title: t('setting.status'),
    },
    {
      prop: 'scenes',
      width: 150,
      align: 'center',
      title: t('setting.scenes'),
    },
    {
      prop: 'fee_rate',
      width: 100,
      align: 'right',
      title: t('setting.feeRate'),
    },
    {
      prop: 'min_amount',
      width: 120,
      align: 'right',
      title: t('setting.minAmount'),
    },
    {
      prop: 'max_amount',
      width: 120,
      align: 'right',
      title: t('setting.maxAmount'),
    },
    {
      prop: 'daily_limit',
      width: 120,
      align: 'right',
      title: t('setting.dailyLimit'),
    },
    {
      prop: 'monthly_limit',
      width: 120,
      align: 'right',
      title: t('setting.monthlyLimit'),
    },
    {
      prop: 'sort_order',
      width: 100,
      align: 'center',
      title: t('setting.sortOrder'),
    },
    {
      prop: 'creator_name',
      width: 120,
      align: 'left',
      title: t('setting.creatorName'),
    },
    {
      prop: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('setting.createTime'),
    },
  ];
  // 查询参数
  const queryParams = ref<SettingPaymentQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<SettingPaymentPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: SettingPaymentQueryPageVO) => {
      const response = await getSettingPaymentPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除支付设置
    remove: async (data: {
      payment_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteSettingPaymentApi(data);
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
        title: t('setting.search'),
        placeholder: t('setting.searchPlaceholder'),
      },
      {
        type: 'select',
        name: 'status',
        title: t('setting.status'),
        options: [
          { label: t('setting.status.active'), value: 'ACTIVE' },
          { label: t('setting.status.inactive'), value: 'INACTIVE' },
          { label: t('setting.status.testing'), value: 'TESTING' },
          { label: t('setting.status.error'), value: 'ERROR' },
        ],
      },
      {
        type: 'select',
        name: 'payment_type',
        title: t('setting.paymentType'),
        options: [
          { label: t('setting.paymentType.alipay'), value: 'ALIPAY' },
          { label: t('setting.paymentType.wechat'), value: 'WECHAT' },
          { label: t('setting.paymentType.unionpay'), value: 'UNIONPAY' },
          { label: t('setting.paymentType.cash'), value: 'CASH' },
          { label: t('setting.paymentType.card'), value: 'CARD' },
          { label: t('setting.paymentType.other'), value: 'OTHER' },
        ],
      },
      {
        type: 'select',
        name: 'scene',
        title: t('setting.scenes'),
        options: [
          { label: t('setting.scene.pos'), value: 'POS' },
          { label: t('setting.scene.online'), value: 'ONLINE' },
          { label: t('setting.scene.mobile'), value: 'MOBILE' },
          { label: t('setting.scene.all'), value: 'ALL' },
        ],
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [PaymentDrawer, { openDrawer: openPaymentDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      payment_type: val.searchVal?.payment_type || undefined,
      scene: val.searchVal?.scene || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: SettingPaymentPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openPaymentDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditPayment = (row: SettingPaymentPageModel) => {
    openPaymentDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: SettingPaymentPageModel) => {
    openPaymentDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理状态切换
  const handleToggleStatus = async (row: SettingPaymentPageModel) => {
    try {
      const newStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await togglePaymentStatusApi({
        payment_id: row.id,
        status: newStatus,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('切换状态失败:', error);
    }
  };

  // 处理排序更新
  const handleUpdateSort = async (paymentIds: number[]) => {
    try {
      await updatePaymentSortApi({
        payment_ids: paymentIds,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('更新排序失败:', error);
    }
  };

  // 处理批量删除
  const handleBatchDeletePayment = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteSettingPaymentApi({
        merchant_id: userStore.merchantId,
        payment_id_list: selectedRows.value.map((item) => item.id),
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
    PaymentDrawer,

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
    handleEditPayment,
    handleDetail,
    handleToggleStatus,
    handleUpdateSort,
    handleBatchDeletePayment,
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
