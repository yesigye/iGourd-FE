import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';
import { formatRangeTime } from '@igourd/utils';
import { dayjs } from 'element-plus';
import { FlowsDrawer } from '@@/account/components';
import type {
  FinanceFlowQueryParams,
  FinanceFlowSearchParams,
  ColumnType,
  BalanceDirection,
  listPageFinanceFlowResponse,
} from '@@/account/types';

import {
  getFinanceFlowPageListApi,
  getFinanceFlowListApi,
  getFinanceFlowTotalApi,
} from '@@/account/apis';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import type { AccountFlowsInfo } from '../../types/account';

export function useFlows() {
  const { t } = useI18n();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<AccountFlowsInfo>[] = [
    {
      field: 'flow_no',
      width: 165,
      align: 'left',
      fixed: 'left',
      title: t('account.serialNumber'),
    },
    {
      field: 'finance_category_name',
      width: 200,
      align: 'left',
      title: t('account.financeCategoryName'),
    },
    {
      field: 'revenue_amount',
      width: 150,
      align: 'left',
      title: t('account.revenueAmount'),
    },
    {
      field: 'expenditure_amount',
      width: 150,
      align: 'left',
      title: t('account.expenditureAmount'),
    },
    {
      field: 'business_original_amount',
      width: 150,
      title: t('account.business_original_amount'),
    },
    {
      field: 'trader_name',
      width: 150,
      title: t('account.trader_name'),
    },
    {
      field: 'target_account_name',
      width: 200,
      title: t('account.target_account_name'),
    },
    {
      field: 'payment_method_name',
      width: 200,
      title: t('account.payment_method'),
    },
    {
      field: 'amount',
      width: 200,
      title: t('account.payment_amount'),
    },
    {
      field: 'source_type',
      width: 150,
      title: t('account.source'),
    },
    {
      field: 'trading_no',
      width: 150,
      title: t('account.tradingNo'),
    },
    {
      field: 'remark',
      width: 150,
      title: t('account.remark'),
    },
    {
      field: 'trading_time',
      width: 150,
      title: t('account.trading_time'),
    },
    {
      field: 'creator_name',
      width: 200,
      title: t('account.creatorName'),
    },
    {
      field: 'create_time',
      width: 180,
      title: t('account.createTime'),
    },
  ];
  // 当前选中的标签类型
  // const selectedTabType = ref<ColumnType>('ALL');

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: FinanceFlowQueryParams) => {
      const payload = {
        ...params,
        source_type_list: params?.source_type_list
          ? params?.source_type_list?.map((str) => str.toUpperCase())
          : undefined,
      };

      if (params.timeRange?.length) {
        payload.start_date = params.timeRange[0]
          ? formatRangeTime(dayjs(params.timeRange[0]))
          : undefined;
        payload.end_date = params.timeRange[1]
          ? formatRangeTime(dayjs(params.timeRange[1]), 'end')
          : undefined;
      }

      const response = await getFinanceFlowPageListApi(payload);
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
    Drawer,
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
  } = useCrud({
    service,
    columns: baseColumns,
    searchFormSchema: {
      keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('common.keywords')}}",
          clearable: true,
        },
      },
    },
    batchOperate: false,
    connectedComponent: FlowsDrawer,
  });

  // 获取标签选项
  const getTabOptions = () => {
    return [
      {
        title: t('common.all'),
        value: 'ALL',
      },
      {
        title: t('account.revenue'),
        value: 'REVENUE',
      },
      {
        title: t('account.expenditure'),
        value: 'EXPENDITURE',
      },
    ];
  };

  return {
    // 组件
    Grid,
    Drawer,
    columns: baseColumns,
    tabOptions: getTabOptions(),
    handleEdit,
    canBatchOperate,
    handleBatchDelete,
    gridApi,
  };
}
