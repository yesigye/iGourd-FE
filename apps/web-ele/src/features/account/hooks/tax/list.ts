import type { TaxPageModel } from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteTaxApi, getTaxPageListApi } from '@@/account/apis';
import { TaxDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useTax() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<TaxPageModel>[] = [
    {
      field: 'name',
      minWidth: 200,
      align: 'left',
      fixed: 'left',
      title: t('account.taxName'),
      sortable: true,
    },
    {
      field: 'tax_type',
      minWidth: 160,
      align: 'left',
      title: t('account.taxType'),
      sortable: true,
      formatter({ cellValue }) {
        return t(`account.${cellValue}`);
      },
    },
    {
      field: 'calculation_type',
      minWidth: 160,
      align: 'left',
      title: t('account.calculationType'),
      sortable: true,
      formatter({ cellValue }) {
        return t(`account.${cellValue}`);
      },
    },
    {
      field: 'percentage',
      minWidth: 160,
      align: 'left',
      title: t('account.percentage'),
      sortable: true,
    },
    {
      field: 'tax_amount',
      minWidth: 160,
      align: 'left',
      title: t('account.taxAmount'),
      sortable: true,
      formatter: 'formatMoney',
    },
    {
      field: 'creator_name',
      minWidth: 200,
      align: 'left',
      title: t('account.creatorName'),
      sortable: true,
    },
    {
      field: 'create_time',
      minWidth: 180,
      align: 'left',
      title: t('account.createTime'),
      sortable: true,
    },
    {
      field: 'operation',
      title: t('account.operation'),
      sortable: true,
      width: 100,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getTaxPageListApi,

    // 删除税务
    remove: async (data: { tax_id_list: number[] }) => {
      return await deleteTaxApi(data);
    },
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      id: 'tax',
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
      batchOperate: true, // 支持批量删除
      connectedComponent: TaxDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
