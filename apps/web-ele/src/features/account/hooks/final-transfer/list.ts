import type { VxeGridProps, VxeGridPropTypes } from '#/adapter/vxe-table';
import type { PurchaseCustomizedInfo } from '#/features/purchase/types/purchase';

import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { listSubLedgerTree } from '@@/account/apis';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

export function useFinalTransfer(periodId: string) {
  const { t } = useI18n();
  const userStore = useUserStore();

  const columns: VxeGridPropTypes.Column<PurchaseCustomizedInfo>[] = [
    {
      field: 'name',
      title: t('account.account'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'current_debit_amount',
      title: t('account.debit-amount'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'current_credit_amount',
      title: t('account.credit-amount'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
  ];
  // Grid 选项配置
  const gridOptions: VxeGridProps<PurchaseCustomizedInfo> = {
    columns,
    height: '',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          return await listSubLedgerTree({
            category: 'PROFIT_AND_LOSS',
            account_set_id: userStore.merchantInfo.account_set_id,
            accounting_period_id: periodId,
          });
        },
      },
    },
  };

  // 使用 useIgourdVxeGrid
  const [Grid, gridApi] = useIgourdVxeGrid({
    gridOptions,
  });
  return {
    // 组件
    Grid,
    gridApi,
    // 配置
    columns,
    gridOptions,
  };
}
