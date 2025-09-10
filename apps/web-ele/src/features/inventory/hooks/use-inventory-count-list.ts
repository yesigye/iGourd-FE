import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { inventoryApi } from '../apis/inventory';
import { ElMessage, ElMessageBox } from 'element-plus';

export function useInventoryCountList() {
  const { t } = useI18n();
  const userInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');
  const merchantId = userInfo?.current_login_user_app?.owner_id;

  // 搜索表单
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.enterCountKeywords')}}",
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
      field: 'count_no',
      title: "{{t('inventory.countNo')}}",
      minWidth: 150,
      fixed: 'left',
    },
    {
      field: 'warehouse_name',
      title: "{{t('inventory.warehouseName')}}",
      minWidth: 120,
    },
    {
      field: 'count_type',
      title: "{{t('inventory.countType')}}",
      minWidth: 100,
      slots: { default: 'count_type' },
    },
    {
      field: 'status',
      title: "{{t('inventory.status')}}",
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'total_products',
      title: "{{t('inventory.totalProducts')}}",
      minWidth: 100,
    },
    {
      field: 'counted_products',
      title: "{{t('inventory.countedProducts')}}",
      minWidth: 100,
    },
    {
      field: 'creator_name',
      title: "{{t('inventory.creator')}}",
      minWidth: 120,
    },
    {
      field: 'create_time',
      title: "{{t('inventory.createTime')}}",
      minWidth: 160,
    },
    {
      field: 'remark',
      title: "{{t('inventory.remark')}}",
      minWidth: 150,
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
        await inventoryApi.batchDeleteCount(ids);
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
    id: 'inventory-count-grid',
    proxyConfig: {
      ajax: {
        query: async ({ page, sorts, filters, form }) => {
          const params = {
            ...form,
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: merchantId,
          };
          const res = await inventoryApi.getCountList(params);
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