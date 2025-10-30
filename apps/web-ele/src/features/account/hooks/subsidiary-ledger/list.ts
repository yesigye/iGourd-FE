import type { ElTree } from '@igourd/common-ui';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { reactive, ref, shallowRef, watch } from 'vue';

import { observable } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { formateMonth, isBetween, isEmpty } from '@igourd/utils';

import {
  getAccountingPeriodsApi,
  getChartOfAccountsTreeApi,
  getSubsidiaryLedgerPageListApi,
} from '@@/account/apis';
import { SubsidiaryLedgerDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';
import { useRemoteTableTabs } from '#/hooks/use-remote-tabs';

import { directionCodeLabel } from '../leaf-ledgers';

export function useSubsidiaryLedger() {
  const { t } = useI18n();
  const {
    merchantInfo: { account_set_id },
  } = useUserStore();
  const treeList = shallowRef();
  const params = reactive({
    account_set_id,
    account_ledger_ids: [],
  });
  const start_accounting_period = observable({ value: '' });
  const end_accounting_period = observable({ value: '' });
  const treeRef = ref<InstanceType<typeof ElTree>>();

  const enabledDate = shallowRef([]);

  function handleNodeClick() {
    // @ts-ignore
    params.account_ledger_ids = treeRef.value?.getCheckedKeys(false);
    if (isEmpty(params.account_ledger_ids)) {
      return;
    }
    gridApi.reload();
  }
  getAccountingPeriodsApi({ account_set_id }).then((res) => {
    enabledDate.value = res?.map((i: any) => {
      return {
        ...i,
        range: [i.start_date, i.end_date],
      };
    });
    if (res?.length <= 0) {
      return;
    }
    const [{ start_date, end_date }] = res;
    start_accounting_period.value = formateMonth(start_date);
    end_accounting_period.value = formateMonth(end_date);
  });
  function getTreeData(category: string) {
    getChartOfAccountsTreeApi({
      category,
    }).then((res) => {
      treeList.value = res;
    });
  }
  const { tabs, tabsOption, tabsActiveKey } = useRemoteTableTabs(
    'basics.accounting.account-ledger-category-enum',
    'category',
  );
  watch(
    tabsActiveKey,
    (val) => {
      const checkedKeys = treeRef.value?.getCheckedKeys(false);
      if (!isEmpty(checkedKeys)) {
        checkedKeys?.forEach((key) => {
          treeRef.value?.setChecked(key, false, true);
        });
      }
      getTreeData(val);
    },
    {
      flush: 'pre',
    },
  );

  watch(
    treeList,
    (val) => {
      const [firstNode] = val;
      treeRef.value?.setChecked(firstNode.id, true, true);
    },
    {
      flush: 'post',
    },
  );
  watch(
    () => [treeList.value, enabledDate.value],
    ([treeValue, periodValue]) => {
      if (isEmpty(treeValue)) {
        return;
      }
      if (isEmpty(periodValue)) {
        return;
      }
      handleNodeClick();
    },
    {
      flush: 'post',
    },
  );
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'create_time',
      title: t('account.date'),
    },
    {
      field: 'account_ledger',
      title: t('account.account'),
    },
    {
      field: 'summary',
      title: t('account.summary'),
    },

    {
      field: 'opposite_account_ledger',
      title: t('account.opposite-accounts'),
    },
    {
      field: 'debit_amount',
      title: t('account.debit-amount'),
      formatter: 'formatMoney',
    },
    {
      field: 'credit_amount',
      title: t('account.credit-amount'),
      formatter: 'formatMoney',
    },
    {
      field: 'balance_direction',
      title: t('account.direction'),
      formatter({ cellValue }: { cellValue: keyof typeof directionCodeLabel }) {
        return t(directionCodeLabel[cellValue]);
      },
    },
    {
      field: 'amount',
      title: t('account.balance'),
      formatter: 'formatMoney',
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: (params: any) => {
      if (isEmpty(params.account_ledger_ids)) {
        return Promise.resolve([]);
      }
      return getSubsidiaryLedgerPageListApi(params);
    },
  };

  // const {} = use

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    canBatchOperate,
    Drawer,
    handleEdit,
    handleBatchDelete,
  } = useCrud({
    params,
    service,
    id: 'subsidiary-ledger',
    proxyConfig: {
      autoLoad: false,
    },
    columns: baseColumns,
    searchFormAppendTo: '#subsidiary-ledger',
    separator: false,
    scope: {
      start_accounting_period,
      end_accounting_period,
    },
    onReset: async (formApi) => {
      getAccountingPeriodsApi({ account_set_id }).then((res) => {
        enabledDate.value = res?.map((i: any) => {
          return {
            ...i,
            range: [i.start_date, i.end_date],
          };
        });
        if (res?.length <= 0) {
          return;
        }
        const [{ start_date, end_date }] = res;
        start_accounting_period.value = formateMonth(start_date);
        end_accounting_period.value = formateMonth(end_date);
      });

      // 设置初始值
      formApi.setInitialValues({
        start_accounting_period: start_accounting_period.value,
        end_accounting_period: end_accounting_period.value,
        keywords: '', // 清空关键词
      });

      // 执行重置
      formApi.reset();
    },
    searchFormSchema: {
      '[start_accounting_period,end_accounting_period]': {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          type: 'monthrange',
          placeholder: t('common.keywords'),
          format: 'YYYY-MM',
          valueFormat: 'YYYY-MM',
          'disabled-date': (value: any) => {
            return !enabledDate.value.find((i) => {
              // @ts-ignore
              return isBetween(value, i.range, 'day');
            });
          },
        },
        'x-reactions': {
          fulfill: {
            state: {
              value:
                '{{ [start_accounting_period.value, end_accounting_period.value ] }}',
            },
          },
        },
      },
      keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: t('subsidiary-ledger.account-ledger-placeholder'),
        },
      },
    },
    batchOperate: false,
    connectedComponent: SubsidiaryLedgerDrawer,
  });

  return {
    Grid,
    Drawer,
    treeList,
    handleEdit,
    canBatchOperate,
    tabs,
    tabsOption,
    handleBatchDelete,
    tabsActiveKey,
    treeRef,
    handleNodeClick,
  };
}
