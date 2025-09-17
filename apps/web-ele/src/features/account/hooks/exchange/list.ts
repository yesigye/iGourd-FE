import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getCurrencyExchangePageListApi,
  deleteCurrencyExchangeApi,
} from '@@/account/apis';
import { ExchangeDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useExchange() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'sell_amount',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('account.sellAmount'),
    },
    {
      field: 'buy_amount',
      width: 200,
      align: 'left',
      title: t('account.buyAmount'),
    },
    {
      field: 'exchange_rate',
      width: 150,
      align: 'center',
      title: t('account.exchangeRate'),
    },
    {
      field: 'sell_currency_name',
      width: 150,
      align: 'center',
      title: t('account.sellCurrency'),
    },
    {
      field: 'buy_currency_name',
      width: 150,
      align: 'center',
      title: t('account.buyCurrency'),
    },
    {
      field: 'exchange_date',
      width: 150,
      align: 'center',
      title: t('account.exchangeDate'),
    },
    {
      field: 'remark',
      width: 200,
      align: 'left',
      title: t('account.remark'),
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getCurrencyExchangePageListApi,
    // 删除汇率
    remove: deleteCurrencyExchangeApi,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('common.keywords'),
          },
        },
      },
      batchOperate: true,
      connectedComponent: ExchangeDrawer,
    });

  return {
    // 组件
    Grid,
    Drawer,

    // 方法
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
