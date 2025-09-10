import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { storeApi } from '../apis/store';
import { ElMessage, ElMessageBox } from 'element-plus';

export function useStoreDeviceList() {
  const { t } = useI18n();
  const userInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');
  const merchantId = userInfo?.current_login_user_app?.owner_id;

  // 搜索表单
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('storeDevice.searchPlaceholder')}}",
        clearable: true,
      },
    },
  };

  // 表格列定义
  const columns = [
    {
      type: 'checkbox',
      width: 55,
      fixed: 'left',
    },
    {
      field: 'device_id',
      title: "{{t('storeDevice.deviceId')}}",
      minWidth: 120,
      fixed: 'left',
    },
    {
      field: 'device_name',
      title: "{{t('storeDevice.deviceName')}}",
      minWidth: 150,
    },
    {
      field: 'device_type',
      title: "{{t('storeDevice.deviceType')}}",
      minWidth: 100,
      slots: { default: 'device_type' },
    },
    {
      field: 'status',
      title: "{{t('storeDevice.status')}}",
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'store_name',
      title: "{{t('storeDevice.storeName')}}",
      minWidth: 120,
    },
    {
      field: 'ip_address',
      title: "{{t('storeDevice.ipAddress')}}",
      minWidth: 120,
    },
    {
      field: 'mac_address',
      title: "{{t('storeDevice.macAddress')}}",
      minWidth: 140,
    },
    {
      field: 'last_online_time',
      title: "{{t('storeDevice.lastOnlineTime')}}",
      minWidth: 160,
    },
    {
      field: 'create_time',
      title: "{{t('storeDevice.createTime')}}",
      minWidth: 160,
    },
    {
      title: "{{t('storeDevice.action')}}",
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: { default: 'action' },
    },
  ];

  // 表格事件
  const gridEvents = {
    // 删除
    onDelete: async (ids: string[]) => {
      try {
        await ElMessageBox.confirm(
          t('storeDevice.deleteConfirmText'),
          t('storeDevice.deleteConfirmTitle'),
          {
            confirmButtonText: t('storeDevice.deleteConfirmBtn'),
            cancelButtonText: t('storeDevice.deleteCancelBtn'),
            type: 'warning',
            closeOnClickModal: false,
          }
        );
        await storeApi.batchDeleteDevice(ids);
        ElMessage.success(t('common.deleteSuccess'));
        gridApi.value?.commitProxy('query');
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(t('common.deleteFailed'));
        }
      }
    },
  };

  // 表格配置
  const gridOptions = {
    columns,
    data: [],
    height: 'auto',
    stripe: true,
    border: true,
    resizable: true,
    showOverflow: 'tooltip',
    showHeaderOverflow: 'tooltip',
    keepSource: true,
    id: 'store-device-grid',
    proxyConfig: {
      ajax: {
        query: async ({ page, sorts, filters, form }) => {
          const params = {
            ...form,
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: merchantId,
          };
          const res = await storeApi.getDeviceList(params);
          return {
            result: res.data.list || [],
            page: {
              total: res.data.total || 0,
            },
          };
        },
      },
    },
  };

  // 表单配置
  const formOptions = {
    schema: searchFormSchema,
  };

  // 使用 VXE Grid
  const { Grid, gridApi } = useIgourdVxeGrid({
    gridOptions,
    formOptions,
    gridEvents,
  });

  return {
    Grid,
    gridApi,
    gridEvents,
    gridOptions,
    formOptions,
  };
}

