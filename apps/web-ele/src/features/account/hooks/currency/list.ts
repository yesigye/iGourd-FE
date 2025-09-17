import type { CurrencyRemoveVO } from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteCurrencyApi, getCurrencyPageListApi } from '@@/account/apis';
import { CurrencyDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useCurrency() {
  const { t } = useI18n();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('account.currencySymbol'),
    },
    {
      field: 'code',
      width: 160,
      align: 'left',
      title: t('account.currencyCode'),
    },
    {
      field: 'exchange_rate',
      width: 160,
      align: 'left',
      title: t('account.exchangeRate'),
    },
    {
      field: 'symbol',
      width: 160,
      align: 'center',
      title: t('account.symbol'),
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getCurrencyPageListApi,
    // 删除货币
    remove: async (data: CurrencyRemoveVO) => {
      return await deleteCurrencyApi(data);
    },
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
            placeholder: t('account.pleaseEnterKeywordsToSearchSelect'),
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: CurrencyDrawer,
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
