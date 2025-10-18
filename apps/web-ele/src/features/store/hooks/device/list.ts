import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  deviceAuthorizationStatusModify,
  getStoreDevicePageListApi,
  merchantDeviceStatusModify,
} from '@@/store/apis';
import { DeviceDrawer } from '@@/store/components';

import { useCrud } from '#/hooks';

export function useStoreDevice() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'name',
      minWidth: 200,
      align: 'left',
      fixed: 'left',
      title: t('storeDevice.name'),
    },
    {
      field: 'code',
      minWidth: 150,
      align: 'left',
      title: t('storeDevice.code'),
    },
    {
      field: 'short_name',
      minWidth: 120,
      align: 'center',
      title: t('storeDevice.short_name'),
      formatter({ row }) {
        return row.merchant_model?.short_name;
      },
    },
    {
      field: 'storename',
      minWidth: 100,
      align: 'center',
      title: t('storeDevice.storename'),
      formatter({ row }) {
        return row.merchant_model?.full_name;
      },
    },
    {
      field: 'mac_address',
      minWidth: 150,
      align: 'left',
      title: t('storeDevice.mac_address'),
    },
    {
      field: 'ip_address',
      minWidth: 100,
      align: 'center',
      title: t('storeDevice.ip_address'),
    },
    {
      title: t('storeDevice.last_login_time'),
      field: 'last_login_time',
      minWidth: 235,
    },
    {
      field: 'login_count',
      minWidth: 200,
      align: 'left',
      title: t('storeDevice.login_count'),
    },
    {
      field: 'software_version',
      minWidth: 180,
      align: 'center',
      title: t('storeDevice.software_version'),
    },
    {
      title: t('storeDevice.version_update_time'),
      field: 'version_update_time',
      minWidth: 235,
    },
    {
      field: 'os_version',
      minWidth: 180,
      align: 'center',
      title: t('storeDevice.os_version'),
    },
    {
      field: 'type',
      minWidth: 180,
      align: 'center',
      title: t('storeDevice.type'),
    },
    {
      field: 'is_authorized',
      minWidth: 180,
      align: 'center',
      fixed: 'right',
      title: t('storeDevice.is_authorized'),
      slots: {
        default: 'is_authorized',
      },
    },
    {
      field: 'status',
      minWidth: 180,
      align: 'center',
      fixed: 'right',
      title: t('storeDevice.status'),
      slots: {
        default: 'status',
      },
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getStoreDevicePageListApi,
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
    id: 'device',
    columns: baseColumns,
    searchFormSchema: {
      keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: t('device.device-name-device-code-placeholder'),
        },
      },
    },
    batchOperate: true,
    connectedComponent: DeviceDrawer,
  });

  function toggleStatus(row: Record<string, any>) {
    return merchantDeviceStatusModify(row).then(() => {
      gridApi.reload();
    });
  }
  function toggleAuthorization(row: Record<string, any>) {
    return deviceAuthorizationStatusModify(row).then(() => {
      gridApi.reload();
    });
  }

  return {
    // 组件
    Grid,
    Drawer,
    toggleStatus,
    toggleAuthorization,
    // 方法
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
