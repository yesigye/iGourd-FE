import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getStoreCreatePageListApi,
  deleteStoreCreateApi,
  submitStoreCreateApi,
} from '@@/store/apis';
import { StoreCreateDrawer } from '@@/store/components';

import { useCrud } from '#/hooks';

export function useStoreCreate() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
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
      field: 'status',
      width: 100,
      align: 'center',
      title: t('store.status'),
    },
    {
      field: 'step',
      width: 120,
      align: 'center',
      title: t('store.step'),
    },
    {
      field: 'progress',
      width: 150,
      align: 'center',
      title: t('store.progress'),
    },
    {
      field: 'address',
      width: 250,
      align: 'left',
      title: t('store.address'),
    },
    {
      field: 'contact_person',
      width: 120,
      align: 'left',
      title: t('store.contactPerson'),
    },
    {
      field: 'contact_phone',
      width: 150,
      align: 'left',
      title: t('store.contactPhone'),
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      title: t('store.createTime'),
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getStoreCreatePageListApi,
    // 删除创建申请
    remove: deleteStoreCreateApi,
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
      batchOperate: true,
      connectedComponent: StoreCreateDrawer,
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
