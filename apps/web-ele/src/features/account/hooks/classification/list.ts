import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getFinanceCategoryListApi,
  deleteFinanceCategoryApi,
} from '@@/account/apis';
import { ClassificationDrawer } from '@@/account/components';

import { useCrud } from '#/hooks';

export function useClassification() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'name',
      width: 180,
      title: t('account.classification'),
    },
    {
      field: 'code',
      width: 120,
      title: t('account.code'),
    },
    {
      field: 'parent_name',
      width: 150,
      title: t('account.parentClassification'),
    },
    {
      field: 'level',
      width: 100,
      title: t('account.level'),
    },
    {
      field: 'sort_order',
      width: 100,
      title: t('account.sortOrder'),
    },
    {
      field: 'status',
      width: 100,
      title: t('account.status'),
    },
    {
      field: 'remark',
      width: 200,
      title: t('account.remark'),
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getFinanceCategoryListApi,
    // 删除分类
    remove: deleteFinanceCategoryApi,
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
      connectedComponent: ClassificationDrawer,
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
