import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  FinalTransferQueryParams,
  FinalTransferData,
  TransferType,
  TransferStatus,
  FinalTransferForm,
} from '@@/account/types';

import {
  getFinalTransferListApi,
  executeFinalTransferApi,
  reverseFinalTransferApi,
  getTransferStatusApi,
} from '@@/account/apis';

export function useFinalTransfer() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'code',
      width: 165,
      fixed: 'left',
      title: t('account.account'),
    },
    {
      prop: 'current_debit_amount',
      width: 200,
      title: t('account.debit_amount'),
    },
    {
      prop: 'current_credit_amount',
      width: 200,
      title: t('account.credit_amount'),
    },
  ];
  // 当前步骤
  const step = ref(1);

  // 结转类型
  const transferType = ref<TransferType>('finalProcessing');

  // 结转列表数据
  const transferList = ref<Record<string, FinalTransferData[]>>({});

  // 当前选中的期间
  const selectedPeriod = ref<FinalTransferData | null>(null);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: FinalTransferQueryParams) => {
      const response = await getFinalTransferListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 执行结转
    execute: async (data: FinalTransferForm) => {
      return await executeFinalTransferApi(data);
    },

    // 撤销结转
    reverse: async (data: { transfer_id: number; merchant_id?: number }) => {
      return await reverseFinalTransferApi(data);
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
  const [Drawer, { openDrawer }] = useDrawer<{
    type: string;
    periodId?: number;
  }>();

  // 处理结转类型变化
  const handleTransferTypeChange = (type: TransferType) => {
    transferType.value = type;
    step.value = 1;
    selectedPeriod.value = null;
    loadTransferList();
  };

  // 加载结转列表
  const loadTransferList = async () => {
    try {
      const response = await getFinalTransferListApi({
        merchant_id: userStore.merchantId,
      });

      // 按年份分组
      const groupedData: Record<string, FinalTransferData[]> = {};
      response.data?.list?.forEach((item: FinalTransferData) => {
        const year = item.year.toString();
        if (!groupedData[year]) {
          groupedData[year] = [];
        }
        groupedData[year].push(item);
      });

      transferList.value = groupedData;
    } catch (error) {
      console.error('加载结转列表失败:', error);
    }
  };

  // 处理期间点击
  const handlePeriodClick = (period: FinalTransferData) => {
    selectedPeriod.value = period;
    step.value = 2;
  };

  // 处理结转执行
  const handleExecuteTransfer = async (formData: FinalTransferForm) => {
    try {
      await executeFinalTransferApi({
        ...formData,
        merchant_id: userStore.merchantId,
      });
      loadTransferList();
      step.value = 1;
      selectedPeriod.value = null;
    } catch (error) {
      console.error('执行结转失败:', error);
    }
  };

  // 处理反结转
  const handleReverseTransfer = async (transferId: number) => {
    try {
      await reverseFinalTransferApi({
        transfer_id: transferId,
        merchant_id: userStore.merchantId,
      });
      loadTransferList();
    } catch (error) {
      console.error('反结转失败:', error);
    }
  };

  // 获取结转状态样式
  const getTransferTypeStyle = (period: FinalTransferData) => {
    if (period.is_current) {
      return {
        cursor: 'cursor-not-allowed',
        bgColor: 'bg-error',
        borderColor: 'border-error',
        textColor: 'text-error',
        isDisable: false,
      };
    }

    switch (period.status) {
      case 'unprocessed':
        return {
          cursor: 'cursor-pointer',
          bgColor: 'bg-leaf-green',
          borderColor: 'border-leaf-green',
          textColor: 'text-leaf-green',
          isDisable: false,
        };
      case 'processed':
        return {
          cursor: 'cursor-pointer',
          bgColor: 'bg-sky-blue',
          borderColor: 'border-sky-blue',
          textColor: 'text-sky-blue',
          isDisable: false,
        };
      case 'reversed':
        return {
          cursor: 'cursor-pointer',
          bgColor: 'bg-silver',
          borderColor: 'border-silver',
          textColor: 'text-silver',
          isDisable: false,
        };
      default:
        return {
          cursor: 'cursor-not-allowed',
          bgColor: 'bg-gray-300',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-500',
          isDisable: true,
        };
    }
  };

  // 获取反结转状态样式
  const getReverseTransferTypeStyle = (period: FinalTransferData) => {
    if (period.is_current) {
      return {
        cursor: 'cursor-not-allowed',
        bgColor: 'bg-error',
        borderColor: 'border-error',
        textColor: 'text-error',
        isDisable: false,
      };
    }

    switch (period.status) {
      case 'processed':
        return {
          cursor: 'cursor-pointer',
          bgColor: 'bg-leaf-green',
          borderColor: 'border-leaf-green',
          textColor: 'text-leaf-green',
          isDisable: false,
        };
      default:
        return {
          cursor: 'cursor-not-allowed',
          bgColor: 'bg-gray-300',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-500',
          isDisable: true,
        };
    }
  };

  return {
    // 组件
    Grid,
    Drawer,

    // 数据
    step,
    transferType,
    transferList,
    selectedPeriod,

    // 配置
    columns: baseColumns,

    // 方法
    handleTransferTypeChange,
    handlePeriodClick,
    handleExecuteTransfer,
    handleReverseTransfer,
    getTransferTypeStyle,
    getReverseTransferTypeStyle,
    loadTransferList,
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
