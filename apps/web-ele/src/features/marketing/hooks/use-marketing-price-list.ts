import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { marketingApi } from '../apis/marketing';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Check, Close } from '@element-plus/icons-vue';

export function useMarketingPriceList() {
  const { t } = useI18n();
  const userInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');
  const merchantId = userInfo?.current_login_user_app?.owner_id;

  // 搜索表单
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('marketing.priceLevelKeywords')}}",
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
      field: 'name',
      title: "{{t('marketing.priceLevelName')}}",
      minWidth: 190,
      fixed: 'left',
    },
    {
      field: 'change_type',
      title: "{{t('marketing.priceLevelType')}}",
      minWidth: 229,
      slots: { default: 'change_type' },
    },
    {
      field: 'change_value',
      title: "{{t('marketing.priceLevelPrice')}}",
      minWidth: 229,
    },
    {
      field: 'change_mode',
      title: "{{t('marketing.changeMode')}}",
      minWidth: 229,
      slots: { default: 'change_mode' },
    },
    {
      field: 'effective_time',
      title: "{{t('marketing.effectiveDate')}}",
      minWidth: 160,
    },
    {
      field: 'expiration_time',
      title: "{{t('marketing.expirationTime')}}",
      minWidth: 170,
    },
    {
      field: 'creator_name',
      title: "{{t('marketing.creator')}}",
      minWidth: 200,
    },
    {
      field: 'create_time',
      title: "{{t('marketing.createTime')}}",
      minWidth: 180,
    },
    {
      field: 'status',
      title: "{{t('marketing.switchStatus')}}",
      width: 85,
      fixed: 'right',
      align: 'center',
      slots: { default: 'status' },
    },
    {
      title: "{{t('marketing.action')}}",
      width: 85,
      fixed: 'right',
      align: 'center',
      slots: { default: 'action' },
    },
  ];

  // 表格事件
  const gridEvents = {
    // 状态切换
    onStatusChange: async (row: any) => {
      const params = {
        id: row.id,
        merchant_id: merchantId,
        status: row.status,
      };
      try {
        if (row.status === 'CLOSE') {
          await marketingApi.statusClosePrice(params);
          ElMessage.success(t('marketing.CloseSuccessfully'));
        } else {
          await marketingApi.statusOpenPrice(params);
          ElMessage.success(t('marketing.OpenSuccessfully'));
        }
        // 刷新列表
        gridApi.value?.commitProxy('query');
      } catch (error) {
        ElMessage.error(t('marketing.OpenFailure'));
      }
    },
    // 删除
    onDelete: async (ids: string[]) => {
      try {
        await ElMessageBox.confirm(
          t('purchase.deleteConfirmText'),
          t('purchase.deleteConfirmTitle'),
          {
            confirmButtonText: t('purchase.deleteConfirmBtn'),
            cancelButtonText: t('purchase.deleteCancelBtn'),
            type: 'warning',
            closeOnClickModal: false,
          }
        );
        await marketingApi.batchDeletePrice(ids);
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
    id: 'marketing-price-grid',
    proxyConfig: {
      ajax: {
        query: async ({ page, sorts, filters, form }) => {
          const params = {
            ...form,
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: merchantId,
          };
          const res = await marketingApi.getPriceList(params);
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