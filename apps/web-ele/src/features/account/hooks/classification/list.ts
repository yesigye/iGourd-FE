import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getFinanceCategoryListApi,
  deleteFinanceCategoryApi,
} from '@@/account/apis';
import { ClassificationDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';
import type { Ref } from 'vue';

export function useClassification(filterType: Ref<string>) {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'name',
      width: 180,
      title: t('account.classification'),
    },
    {
      field: 'type',
      width: 120,
      title: t('account.revenue_and_expenditure'),
    },
    {
      field: 'ledger_names',
      width: 150,
      title: t('account.classification_form.debit'),
    },
    {
      field: 'target_ledger_name',
      width: 100,
      title: t('account.classification_form.credit'),
    },
    {
      field: 'remark',
      width: 300,
      title: t('account.remark'),
    },
    {
      field: 'creator_name',
      width: 100,
      title: t('account.creatorName'),
    },
    {
      field: 'create_time',
      width: 120,
      title: t('account.createTime'),
    },
    {
      field: 'operation',
      title: t('account.operation'),
      sortable: true,
      minWidth: 180,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: (params: { page_num: number; page_size: number; type: string }) =>
      getFinanceCategoryListApi({ ...params, type: filterType.value }),
    // 删除分类
    remove: deleteFinanceCategoryApi,
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    canBatchOperate,
    Drawer,
    handleEdit,
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
          placeholder: t('common.keywords'),
        },
      },
    },
    batchOperate: true,
    connectedComponent: ClassificationDrawer,
  });

  return {
    // 组件
    Grid,
    gridApi,
    Drawer,

    // 方法
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
