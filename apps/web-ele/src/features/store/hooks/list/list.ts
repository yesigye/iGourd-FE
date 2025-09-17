import type { StoreListPageModel } from '@@/store/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteStoreListApi, getStoreListPageListApi } from '@@/store/apis';
import { StoreListDrawer } from '@@/store/components';

import { useCrud } from '#/hooks';

export function useStoreList() {
  const { t } = useI18n();
  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<StoreListPageModel>[] = [
    {
      field: 'store_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('store.storeName'),
    },
    {
      field: 'store_code',
      width: 150,
      align: 'left',
      title: t('store.storeCode'),
    },
    {
      field: 'store_type',
      width: 120,
      align: 'center',
      title: t('store.storeType'),
    },
    {
      field: 'status',
      width: 100,
      align: 'center',
      title: t('store.status'),
    },
    {
      field: 'address',
      width: 250,
      align: 'left',
      title: t('store.address'),
    },
    {
      field: 'city',
      width: 120,
      align: 'left',
      title: t('store.city'),
    },
    {
      field: 'phone',
      width: 150,
      align: 'left',
      title: t('store.phone'),
    },
    {
      field: 'manager_name',
      width: 120,
      align: 'left',
      title: t('store.managerName'),
    },
    {
      field: 'open_date',
      width: 150,
      align: 'center',
      title: t('store.openDate'),
    },
    {
      field: 'total_sales',
      width: 120,
      align: 'right',
      title: t('store.totalSales'),
    },
    {
      field: 'total_orders',
      width: 100,
      align: 'center',
      title: t('store.totalOrders'),
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('store.creatorName'),
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('store.createTime'),
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: { page_num: number; page_size: number }) => {
      const response = await getStoreListPageListApi({
        ...params,
           keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
      });
      return {
        list: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除店铺
    remove: async (data: { store_id_list: number[] }) => {
      return await deleteStoreListApi(data);
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
            placeholder: t('store.searchPlaceholder'),
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: StoreListDrawer,
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
