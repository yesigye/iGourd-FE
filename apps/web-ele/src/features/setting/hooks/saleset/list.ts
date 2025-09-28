import type { SettingSalesetPageModel } from '@@/setting/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

// import {
//   deleteSettingSalesetApi,
//   getSettingSalesetPageListApi,
// } from '@@/setting/apis';
import { SalesetDrawer } from '@@/setting/components';

import { useCrud } from '#/hooks';

export function useSettingSaleset() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<SettingSalesetPageModel>[] = [
    {
      field: 'setting_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('setting.settingName'),
      sortable: true,
    },
    {
      field: 'setting_key',
      width: 150,
      align: 'left',
      title: t('setting.settingKey'),
      sortable: true,
    },
    {
      field: 'setting_value',
      width: 200,
      align: 'left',
      title: t('setting.settingValue'),
      sortable: true,
    },
    {
      field: 'setting_type',
      width: 120,
      align: 'center',
      title: t('setting.settingType'),
      sortable: true,
    },
    {
      field: 'status',
      width: 100,
      align: 'center',
      title: t('setting.status'),
      sortable: true,
    },
    {
      field: 'group_name',
      width: 150,
      align: 'left',
      title: t('setting.groupName'),
      sortable: true,
    },
    {
      field: 'description',
      width: 200,
      align: 'left',
      title: t('setting.description'),
      sortable: true,
    },
    {
      field: 'sort_order',
      width: 100,
      align: 'center',
      title: t('setting.sortOrder'),
      sortable: true,
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('setting.creatorName'),
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('setting.createTime'),
      sortable: true,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getSettingSalesetPageListApi,

    // 删除销售设置
    remove: deleteSettingSalesetApi,
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
            placeholder: t('setting.searchPlaceholder'),
          },
        },
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('setting.status'),
            options: [
              { label: t('setting.status.active'), value: 'ACTIVE' },
              { label: t('setting.status.inactive'), value: 'INACTIVE' },
            ],
          },
        },
        group_name: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('setting.groupName'),
            options: [
              { label: t('setting.group.product'), value: 'product' },
              { label: t('setting.group.sales'), value: 'sales' },
              { label: t('setting.group.cashier'), value: 'cashier' },
              { label: t('setting.group.inventory'), value: 'inventory' },
            ],
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: SalesetDrawer,
    });

  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
