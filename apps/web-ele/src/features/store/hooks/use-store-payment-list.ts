import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { storeApi } from '../apis/store';
import { ElMessage, ElMessageBox } from 'element-plus';

export function useStorePaymentList() {
  const { t } = useI18n();
  const userInfo = JSON.parse(localStorage.getItem('userinfo') || '{}');
  const merchantId = userInfo?.current_login_user_app?.owner_id;

  // 搜索表单
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('storePayment.searchPlaceholder')}}",
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
      field: 'payment_id',
      title: "{{t('storePayment.paymentId')}}",
      minWidth: 120,
      fixed: 'left',
    },
    {
      field: 'store_name',
      title: "{{t('storePayment.storeName')}}",
      minWidth: 150,
    },
    {
      field: 'payment_method',
      title: "{{t('storePayment.paymentMethod')}}",
      minWidth: 120,
      slots: { default: 'payment_method' },
    },
    {
      field: 'amount',
      title: "{{t('storePayment.amount')}}",
      minWidth: 120,
      align: 'right',
      slots: { default: 'amount' },
    },
    {
      field: 'status',
      title: "{{t('storePayment.status')}}",
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'transaction_id',
      title: "{{t('storePayment.transactionId')}}",
      minWidth: 150,
    },
    {
      field: 'payment_time',
      title: "{{t('storePayment.paymentTime')}}",
      minWidth: 160,
    },
    {
      field: 'create_time',
      title: "{{t('storePayment.createTime')}}",
      minWidth: 160,
    },
    {
      title: "{{t('storePayment.action')}}",
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
          t('storePayment.deleteConfirmText'),
          t('storePayment.deleteConfirmTitle'),
          {
            confirmButtonText: t('storePayment.deleteConfirmBtn'),
            cancelButtonText: t('storePayment.deleteCancelBtn'),
            type: 'warning',
            closeOnClickModal: false,
          }
        );
        await storeApi.batchDeletePayment(ids);
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
    id: 'store-payment-grid',
    proxyConfig: {
      ajax: {
        query: async ({ page, sorts, filters, form }) => {
          const params = {
            ...form,
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: merchantId,
          };
          const res = await storeApi.getPaymentList(params);
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

