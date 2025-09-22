import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import { deleteStoreDeviceApi, getStoreDevicePageListApi } from '@@/store/apis';
import { DeviceDrawer } from '@@/store/components';

import { useCrud } from '#/hooks';

export function useStoreDevice() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'device_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('store.deviceName'),
    },
    {
      field: 'device_code',
      width: 150,
      align: 'left',
      title: t('store.deviceCode'),
    },
    {
      field: 'device_type',
      width: 120,
      align: 'center',
      title: t('store.deviceType'),
    },
    {
      field: 'status',
      width: 100,
      align: 'center',
      title: t('store.status'),
    },
    {
      field: 'ip_address',
      width: 150,
      align: 'left',
      title: t('store.ipAddress'),
    },
    {
      field: 'port',
      width: 100,
      align: 'center',
      title: t('store.port'),
    },
    {
      field: 'location',
      width: 200,
      align: 'left',
      title: t('store.location'),
    },
    {
      field: 'last_online_time',
      width: 180,
      align: 'center',
      title: t('store.lastOnlineTime'),
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
    query: getStoreDevicePageListApi,
    // 删除设备
    remove: deleteStoreDeviceApi,
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
      connectedComponent: DeviceDrawer,
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
