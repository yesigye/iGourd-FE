import type { TaxPageModel } from '@@/account/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getTaxPageListApi,
  deleteTaxApi,
} from '@@/account/apis';
import { TaxDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useTax() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<TaxPageModel>[] = [
    {
      field: 'name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('account.taxName'),
      sortable: true,
    },
    {
      field: 'tax_type',
      width: 160,
      align: 'left',
      title: t('account.taxType'),
      sortable: true,
    },
    {
      field: 'calculation_type',
      width: 160,
      align: 'left',
      title: t('account.calculationType'),
      sortable: true,
    },
    {
      field: 'percentage',
      width: 160,
      align: 'left',
      title: t('account.percentage'),
      sortable: true,
    },
    {
      field: 'tax_amount',
      width: 160,
      align: 'left',
      title: t('account.taxAmount'),
      sortable: true,
    },
    {
      field: 'creator_name',
      width: 200,
      align: 'left',
      title: t('account.creatorName'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 180,
      align: 'left',
      title: t('account.createTime'),
      sortable: true,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async ({ page_num, page_size }: { page_num: number; page_size: number }) => {
      const response = await getTaxPageListApi({ page_num, page_size });
      return {
        list: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除税务
    remove: async (data: { tax_id_list: number[] }) => {
      return await deleteTaxApi(data);
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
            placeholder: t('account.please_enter_keywords'),
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
