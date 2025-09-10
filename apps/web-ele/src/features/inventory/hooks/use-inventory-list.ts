import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { inventoryApi } from '../apis/inventory';
import { ElMessage, ElMessageBox } from 'element-plus';

export function useInventoryList() {
  const { t } = useI18n();
  const userInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');
  const merchantId = userInfo?.current_login_user_app?.owner_id;

  // 搜索表单
  const searchFormSchema = {
    warehouse_ids: {
      type: 'array',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.pleaseSelectWarehouse')}}",
        multiple: true,
        options: [],
      },
    },
    product_id: {
      type: 'string',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.inventory_select_placeholder')}}",
        options: [],
        filterable: true,
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
      field: 'product_code',
      title: "{{t('inventory.productCode')}}",
      minWidth: 120,
      fixed: 'left',
    },
    {
      field: 'product_name',
      title: "{{t('inventory.productName')}}",
      minWidth: 200,
    },
    {
      field: 'warehouse_name',
      title: "{{t('inventory.warehouseName')}}",
      minWidth: 120,
    },
    {
      field: 'current_stock',
      title: "{{t('inventory.currentStock')}}",
      minWidth: 100,
      align: 'right',
    },
    {
      field: 'available_stock',
      title: "{{t('inventory.availableStock')}}",
      minWidth: 100,
      align: 'right',
    },
    {
      field: 'reserved_stock',
      title: "{{t('inventory.reservedStock')}}",
      minWidth: 100,
      align: 'right',
    },
    {
      field: 'cost_price',
      title: "{{t('inventory.costPrice')}}",
      minWidth: 100,
      align: 'right',
      slots: { default: 'cost_price' },
    },
    {
      field: 'total_value',
      title: "{{t('inventory.totalValue')}}",
      minWidth: 120,
      align: 'right',
      slots: { default: 'total_value' },
    },
    {
      field: 'last_in_date',
      title: "{{t('inventory.lastInDate')}}",
      minWidth: 120,
    },
    {
      field: 'last_out_date',
      title: "{{t('inventory.lastOutDate')}}",
      minWidth: 120,
    },
    {
      title: "{{t('inventory.action')}}",
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
          t('inventory.deleteConfirmText'),
          t('inventory.deleteConfirmTitle'),
          {
            confirmButtonText: t('inventory.deleteConfirmBtn'),
            cancelButtonText: t('inventory.deleteCancelBtn'),
            type: 'warning',
            closeOnClickModal: false,
          }
        );
        await inventoryApi.batchDelete(ids);
        ElMessage.success(t('common.deleteSuccess'));
        gridApi.value?.commitProxy('query');
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(t('common.deleteFailed'));
        }
      }
    },
    // 清空库存
    onClear: async (ids: string[]) => {
      try {
        await ElMessageBox.confirm(
          t('inventory.clearConfirmText'),
          t('inventory.clearConfirmTitle'),
          {
            confirmButtonText: t('inventory.clearConfirmBtn'),
            cancelButtonText: t('inventory.clearCancelBtn'),
            type: 'warning',
            closeOnClickModal: false,
          }
        );
        await inventoryApi.clear(ids);
        ElMessage.success(t('inventory.clearSuccess'));
        gridApi.value?.commitProxy('query');
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(t('inventory.clearFailed'));
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
    id: 'inventory-list-grid',
    proxyConfig: {
      ajax: {
        query: async ({ page, sorts, filters, form }) => {
          const params = {
            ...form,
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: merchantId,
          };
          const res = await inventoryApi.getPageList(params);
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