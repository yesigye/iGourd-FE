import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';
import { ClassificationDrawer } from '@@/account/components';

import {
  createFinanceCategoryApi,
  deleteFinanceCategoryApi,
  getFinanceCategoryDetailApi,
  getFinanceCategoryListApi,
  updateFinanceCategoryApi,
} from '@@/account/apis';

import { useCrud } from '#/hooks';

export function useClassification() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'name',
      minWidth: 180,
      title: t('account.classification'),
    },
    {
      field: 'type',
      minWidth: 120,
      title: t('account.revenue-and-expenditure'),
      formatter({ cellValue }) {
        return t(`account.${cellValue}`);
      },
    },
    {
      field: 'ledger_names',
      minWidth: 150,
      title: t('account.classification-form.debit'),
    },
    {
      field: 'target_ledger_name',
      minWidth: 100,
      title: t('account.classification-form.credit'),
    },
    {
      field: 'remark',
      minWidth: 300,
      title: t('account.remark'),
    },
    {
      field: 'creator_name',
      minWidth: 100,
      title: t('account.creator-name'),
    },
    {
      field: 'create_time',
      minWidth: 120,
      title: t('account.create-time'),
    },
    {
      field: 'operation',
      title: t('account.operation'),
      sortable: true,
      width: 120,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getFinanceCategoryListApi,
    create: createFinanceCategoryApi,
    update: updateFinanceCategoryApi,
    detail: getFinanceCategoryDetailApi,
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
    id: 'class-ification',
    tabs: [
      {
        label: '全部',
        value: 'ALL',
      },
      {
        label: '收入',
        value: 'REVENUE',
      },
      {
        label: '支出',
        value: 'EXPENDITURE',
      },
    ],
    tabsOption: {
      defaultActiveValue: 'ALL',
      formKey: 'type',
    },
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
