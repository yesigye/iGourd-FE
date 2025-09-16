import type { CountItem, CountParams, CountDetailResponse, CountAuditParams } from '../../types/count';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventoryCountApi } from '../../apis/count';
import { useCrud } from '@/composables/useCrud';
import { useUserStore } from '@igourd/stores/modules/useUserStore';
import { storeToRefs } from 'pinia';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, h, computed } from 'vue';
import { formatNumber, retainDecimal8 } from '@/common/functions';
import AuditOpinionDialog from '@/components/Audit/AuditOpinionDialog.vue';
import InventoryCountAdd from '../../components/count/InventoryCountAdd.vue';
import InventoryProductsDetail from '../../components/count/InventoryProductsDetail.vue';
import PrintIndex from '@/components/Print/Index.vue';
import { filterAndUpdateDynamicFields } from '@/common/functions';
import { dynamicLabelList, columnsProduct } from './configs/count.config';

export function useInventoryCountList() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const { merchantId } = storeToRefs(userStore);

  const auditDialogRef = ref<InstanceType<typeof AuditOpinionDialog> | null>(null);
  const countAddDrawer = ref({
    visible: false,
    title: '',
    currentId: null as number | null,
    isDisabled: false,
  });
  const countDetailDialog = ref({
    visible: false,
    title: '',
    countId: null as number | null,
  });
  const printDrawer = ref({
    visible: false,
    documentNumber: '',
    dynamicFieldsList: [] as any[],
    productDetails: [] as any[],
    productColumnsList: [] as any[],
  });

  const getStatusInfo = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
      case 'PENDING':
        return { icon: 'icon-daishenhe', color: '#7D90B2', text: t('inventory.pendingReview') };
      case 'APPROVED':
        return { icon: 'icon-SURE', color: '#13BA67', text: t('inventory.approved') };
      case 'REJECTED':
        return { icon: 'icon-fILED', color: '#FF0000', text: t('inventory.rejected') };
      default:
        return { icon: 'icon-daishenhe', color: '#7D90B2', text: t('inventory.pendingReview') };
    }
  };

  const columns: VxeGridPropTypes.Column<CountItem>[] = [
    {
      type: 'checkbox',
      width: 55,
      fixed: 'left',
      selectable: ({ row }) => row.review_status !== 'APPROVED' && row.review_status !== 'REJECTED'
    },
    {
      field: 'physical_stock_take_no',
      title: t('inventory.physicalStockTakeNo'),
      minWidth: 230,
      fixed: 'left'
    },
    {
      field: 'physical_stock_take_date',
      title: t('inventory.physicalStockTakeDate'),
      minWidth: 160,
      formatter: ({ cellValue }) => cellValue ? cellValue.split(' ')[0] : ''
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse'),
      minWidth: 150
    },
    {
      field: 'origin_total_quantity',
      title: t('inventory.originTotalQuantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue)
    },
    {
      field: 'physical_total_quantity',
      title: t('inventory.physicalTotalQuantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue)
    },
    {
      field: 'total_variance_quantity',
      title: t('inventory.totalVarianceQuantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue)
    },
    {
      field: 'total_variance_selling_price',
      title: t('inventory.totalVarianceSellingPrice'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue)
    },
    {
      field: 'total_variance_cost',
      title: t('inventory.totalVarianceCost'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue)
    },
    {
      field: 'review_status',
      title: t('inventory.review'),
      minWidth: 85,
      align: 'center',
      slots: {
        default: ({ row }) => {
          const statusInfo = getStatusInfo(row.review_status);
          return h(
            'i',
            {
              class: ['iconfont', statusInfo.icon],
              style: {
                cursor: row.review_status === 'PENDING' ? 'pointer' : 'not-allowed',
                color: statusInfo.color,
              },
              onClick: () => {
                if (row.review_status === 'PENDING') {
                  auditDialogRef.value?.open({ ...row, review_status: 'PENDING' });
                }
              },
            }
          );
        },
      },
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 200
    },
    {
      field: 'create_time',
      title: t('inventory.creationTime'),
      minWidth: 180,
      sortable: true,
      formatter: 'formatDateTime'
    },
    {
      field: 'operation',
      title: t('inventory.action'),
      width: 135,
      fixed: 'right',
      slots: { default: 'operation' }
    }
  ];

  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.enterCountKeywords')}}",
        clearable: true
      }
    },
    physical_stock_take_no: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.physicalStockTakeNo')}}",
        clearable: true
      }
    },
    warehouse_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('inventory.warehouse')}}",
        clearable: true
      }
    },
    physical_stock_take_date: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
      'x-component-props': {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: "{{t('inventory.startDate')}}",
        endPlaceholder: "{{t('inventory.endDate')}}",
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  };

  const crud = useCrud<CountItem, CountParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      query: inventoryCountApi.getCountList,
      drop: async (ids) => {
        if (!ids.length) {
          ElMessage.warning(t('inventory.pleaseSelectItemsToDelete'));
          return Promise.reject(t('inventory.pleaseSelectItemsToDelete'));
        }

        // Check if any selected item is not PENDING
        const nonPendingItems = crud.selectedRows.value.filter(item =>
          item.review_status !== 'PENDING'
        );
        if (nonPendingItems.length > 0) {
          ElMessage.warning(t('inventory.cannotDeleteApprovedOrRejected'));
          return Promise.reject(t('inventory.cannotDeleteApprovedOrRejected'));
        }

        return ElMessageBox.confirm(
          t('inventory.confirmDeleteSelectedItems'),
          t('inventory.warning'),
          {
            confirmButtonText: t('inventory.confirm'),
            cancelButtonText: t('inventory.cancel'),
            type: 'warning'
          }
        )
          .then(async () => {
            const res = await inventoryCountApi.deleteCount({
              physical_stock_take_ids: ids,
              merchant_id: merchantId.value
            });
            if (res.code === 'SUCCESS') {
              ElMessage.success(t('inventory.deleteSuccessful'));
              return Promise.resolve(res);
            } else {
              ElMessage.error(res.message);
              return Promise.reject(res.message);
            }
          })
          .catch(() => {
            ElMessage.info(t('inventory.cancelDelete'));
            return Promise.reject(t('inventory.cancelDelete'));
          });
      }
    },
    defaultQuery: {
      merchant_id: merchantId.value
    }
  });

  const handleAdd = () => {
    countAddDrawer.value.title = t('inventory.addInventoryCountSave');
    countAddDrawer.value.currentId = null;
    countAddDrawer.value.isDisabled = false;
    countAddDrawer.value.visible = true;
  };

  const handleEdit = (id: number) => {
    countAddDrawer.value.title = t('inventory.editInventoryCountSave');
    countAddDrawer.value.currentId = id;
    countAddDrawer.value.isDisabled = false;
    countAddDrawer.value.visible = true;
  };

  const handleDetail = (id: number) => {
    countAddDrawer.value.title = t('inventory.inventoryCountDetail');
    countAddDrawer.value.currentId = id;
    countAddDrawer.value.isDisabled = true;
    countAddDrawer.value.visible = true;
  };

  const handlePrint = async (row: CountItem) => {
    const res = await inventoryCountApi.getCountDetail({
      merchant_id: merchantId.value,
      physical_stock_take_id: row.id
    });
    if (res.code === 'SUCCESS' && res.data) {
      printDrawer.value.documentNumber = res.data.physical_stock_take_no;

      // 计算差异数据
      const productDetails = res.data.physical_stock_take_item_models.map((item: any) => ({
        ...item,
        total_variance_quantity: retainDecimal8(
          item.physical_quantity - item.origin_quantity,
          8
        ),
        total_variance_selling_price: retainDecimal8(
          item.physical_quantity * item.selling_price - item.origin_quantity * item.selling_price,
          2
        ),
        total_variance_cost: retainDecimal8(
          item.physical_quantity * item.cost_price - item.origin_quantity * item.cost_price,
          2
        )
      }));

      printDrawer.value.productDetails = productDetails;
      printDrawer.value.dynamicFieldsList = filterAndUpdateDynamicFields(res.data, dynamicLabelList);
      printDrawer.value.productColumnsList = columnsProduct;
      printDrawer.value.visible = true;
    } else {
      ElMessage.error(res.message);
    }
  };

  const handleAuditConfirm = async (data: { id: number; review_status: 'APPROVED' | 'REJECTED'; remarks?: string }) => {
    const params: CountAuditParams = {
      id: data.id,
      merchant_id: merchantId.value,
      review_status: data.review_status,
      review_opinion: data.remarks,
      total_variance_quantity: 0 // This should be calculated from the actual data
    };

    try {
      const res = await inventoryCountApi.updateCountStatus(params);
      if (res.code === 'SUCCESS') {
        ElMessage.success(t('common.operationSuccess'));
        crud.query(); // Refresh list
      } else {
        ElMessage.error(res.message);
      }
    } catch (error: any) {
      ElMessage.error(error.message || t('common.errorOccurred'));
    }
  };

  return {
    ...crud,
    countAddDrawer,
    countDetailDialog,
    printDrawer,
    handleAdd,
    handleEdit,
    handleDetail,
    handlePrint,
    auditDialogRef,
    handleAuditConfirm,
    getStatusInfo
  };
}
