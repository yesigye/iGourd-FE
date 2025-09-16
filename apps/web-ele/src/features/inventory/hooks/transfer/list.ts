import type { TransferItem, TransferParams, TransferStatusOption } from '../../types/transfer';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventoryTransferApi } from '../../apis/transfer';
import { useCrud } from '@/composables/useCrud';
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatNumber } from '@/common/functions';
import { retainDecimal8 } from '@/utils/eleValidate';

export function useInventoryTransferList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<TransferItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
      selectable: (row) => {
        // 复杂的删除条件判断
        let canDelete = row.transfer_type !== 'TRANSFER_DIFFERENT_STORE';
        if (canDelete) {
          if (row.transfer_type === 'TRANSFER_OUT_ONLY' && row.review_status === 'REJECTED') {
            return true;
          }
          if (row.transfer_type === 'TRANSFER_IN_ONLY' && row.status === 'OUTBOUND' && row.destination_status === 'CREATED') {
            return true;
          }
          if (row.status === 'CREATED' && row.destination_status === 'CREATED') {
            return true;
          }
          if (row.review_status === 'APPROVED' && row.destination_review_status === 'APPROVED') {
            return true;
          }
          if (row.review_status === 'APPROVED' && row.destination_review_status === 'REJECTED') {
            return true;
          }
          if (row.status === 'REFUSED_OUTBOUND' && row.review_status === 'REJECTED') {
            return true;
          }
          return false;
        }
        return false;
      }
    },
    {
      field: 'transfer_type',
      title: t('inventory.transferType'),
      minWidth: 200,
      fixed: 'left',
      formatter: ({ cellValue }) => {
        const typeMap = {
          TRANSFER_SAME_STORE: t('inventory.sameStoreTransfer'),
          TRANSFER_DIFFERENT_STORE: t('inventory.differentStoreTransfer'),
          TRANSFER_IN_ONLY: t('inventory.transferOut'),
          TRANSFER_OUT_ONLY: t('inventory.transferIn')
        };
        return typeMap[cellValue] || cellValue;
      }
    },
    {
      field: 'stock_transfer_no',
      title: t('inventory.stock_transfer_no'),
      minWidth: 200
    },
    {
      field: 'transfer_date',
      title: t('inventory.transfer_date'),
      minWidth: 200,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? cellValue.split(' ')[0] : ''
    },
    {
      field: 'total_transfer_quantity',
      title: t('inventory.total_transfer_quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => formatNumber(cellValue)
    },
    {
      field: 'source_warehouse_name',
      title: t('inventory.source_warehouse_name'),
      minWidth: 150
    },
    {
      field: 'destination_warehouse_name',
      title: t('inventory.destination_warehouse_name'),
      minWidth: 150
    },
    {
      field: 'status',
      title: t('inventory.out_state'),
      minWidth: 168,
      fixed: 'right',
      slots: { default: 'status' }
    },
    {
      field: 'review_status',
      title: t('inventory.status'),
      minWidth: 135,
      fixed: 'right',
      slots: { default: 'reviewStatus' }
    },
    {
      field: 'destination_review_status',
      title: t('inventory.review'),
      minWidth: 120,
      fixed: 'right',
      slots: { default: 'destinationReviewStatus' }
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
      minWidth: 145,
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
        placeholder: "{{t('inventory.enterTransferKeywords')}}",
        clearable: true
      }
    },
    transfer_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.transferType')}}",
        clearable: true,
        options: [
          { label: t('inventory.sameStoreTransfer'), value: 'TRANSFER_SAME_STORE' },
          { label: t('inventory.differentStoreTransfer'), value: 'TRANSFER_DIFFERENT_STORE' },
          { label: t('inventory.transferOut'), value: 'TRANSFER_IN_ONLY' },
          { label: t('inventory.transferIn'), value: 'TRANSFER_OUT_ONLY' }
        ]
      }
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.status')}}",
        clearable: true,
        options: [
          { label: t('inventory.created'), value: 'CREATED' },
          { label: t('inventory.outbound'), value: 'OUTBOUND' },
          { label: t('inventory.inbound'), value: 'INBOUND' },
          { label: t('inventory.refusedOutbound'), value: 'REFUSED_OUTBOUND' },
          { label: t('inventory.refusedInbound'), value: 'REFUSED_INBOUND' }
        ]
      }
    }
  };

  // 选中的行
  const selectedRows = ref<TransferItem[]>([]);

  // 处理选择变化
  const handleSelectionChange = (selection: TransferItem[]) => {
    selectedRows.value = selection;
  };

  // 获取状态选项
  const getStatusOptions = (row: TransferItem): TransferStatusOption[] => {
    const baseOptions = [{ value: 'CREATED', label: t('inventory.created'), key: 'created' }];

    switch (row.transfer_type) {
      case 'TRANSFER_OUT_ONLY':
        if (row.status !== 'CREATED') {
          return [
            { value: 'OUTBOUND', label: t('inventory.transferOut'), key: 'transfer_out' },
            { value: 'REFUSED_OUTBOUND', label: t('inventory.rejectOut'), key: 'reject_out' }
          ];
        }
        return [
          { value: 'OUTBOUND', label: t('inventory.transferOut'), key: 'transfer_out' }
        ];

      case 'TRANSFER_IN_ONLY':
        if (row.status !== 'CREATED') {
          return [{ value: 'INBOUND', label: t('inventory.transferIn'), key: 'transfer_in' }];
        }
        return [
          ...baseOptions,
          { value: 'INBOUND', label: t('inventory.transferIn'), key: 'transfer_in' }
        ];

      case 'TRANSFER_SAME_STORE':
        if (row.status !== 'CREATED') {
          if (row.status === 'OUTBOUND') {
            return [{ value: 'INBOUND', label: t('inventory.transferIn'), key: 'transfer_in' }];
          }
          return [
            { value: 'INBOUND', label: t('inventory.transferIn'), key: 'transfer_in' },
            { value: 'REFUSED_INBOUND', label: t('inventory.rejectIn'), key: 'reject_in' },
            { value: 'OUTBOUND', label: t('inventory.transferOut'), key: 'transfer_out' },
            { value: 'REFUSED_OUTBOUND', label: t('inventory.rejectOut'), key: 'reject_out' }
          ];
        }
        if (row.status === 'CREATED') {
          return [...baseOptions, { value: 'OUTBOUND', label: t('inventory.transferOut'), key: 'transfer_out' }];
        }
        return [
          ...baseOptions,
          { value: 'INBOUND', label: t('inventory.transferIn'), key: 'transfer_in' },
          { value: 'OUTBOUND', label: t('inventory.transferOut'), key: 'transfer_out' }
        ];

      case 'TRANSFER_DIFFERENT_STORE':
        // 这里需要根据当前用户是源门店还是目标门店来决定选项
        // 简化处理，返回所有选项
        return [
          ...baseOptions,
          { value: 'INBOUND', label: t('inventory.transferIn'), key: 'transfer_in' },
          { value: 'REFUSED_INBOUND', label: t('inventory.rejectIn'), key: 'reject_in' },
          { value: 'OUTBOUND', label: t('inventory.transferOut'), key: 'transfer_out' },
          { value: 'REFUSED_OUTBOUND', label: t('inventory.rejectOut'), key: 'reject_out' }
        ];

      default:
        return baseOptions;
    }
  };

  // 审核选项
  const reviewOptions = [
    { value: 'PENDING', label: t('inventory.pending'), key: 'PENDING', disabled: true },
    { value: 'APPROVED', label: t('inventory.approve'), key: 'transfer_state', disabled: false },
    { value: 'REJECTED', label: t('inventory.reject'), key: 'receiving', disabled: false }
  ];

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { icon: 'icon-daishenhe', color: '#7D90B2' };
      case 'APPROVED':
        return { icon: 'icon-SURE', color: '#13BA67' };
      case 'REJECTED':
        return { icon: 'icon-fILED', color: '#FF0000' };
      default:
        return { icon: 'icon-daishenhe', color: '#7D90B2' };
    }
  };

  // 处理删除
  const handleDelete = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning(t('inventory.pleaseSelectItemsToDelete'));
      return;
    }

    try {
      await ElMessageBox.confirm(
        t('inventory.deleteTransfer'),
        t('inventory.warning'),
        {
          confirmButtonText: t('inventory.yes'),
          cancelButtonText: t('inventory.no'),
          type: 'warning',
          closeOnClickModal: false
        }
      );

      const res = await inventoryTransferApi.deleteTransfer({
        stock_transfer_ids: selectedRows.value.map(item => item.id),
        merchant_id: 1 // 这里应该从用户信息获取
      });

      if (res.code === 'SUCCESS') {
        ElMessage.success(t('inventory.deleteSuccess'));
        // 刷新数据
        // 这里应该调用刷新方法
      } else {
        ElMessage.warning(res.message);
      }
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.info(t('inventory.cancelDelete'));
      }
    }
  };

  // 处理编辑
  const handleEdit = (row: TransferItem) => {
    console.log('编辑调拨记录', row);
  };

  // 处理详情
  const handleDetail = (row: TransferItem) => {
    console.log('查看调拨详情', row);
  };

  // 处理打印
  const handlePrint = (row: TransferItem) => {
    console.log('打印调拨单', row);
  };

  // 处理状态变更
  const handleStatusChange = async (row: TransferItem, value: string) => {
    console.log('状态变更', row, value);
  };

  // 处理审核
  const handleReview = async (row: TransferItem, value: string) => {
    console.log('审核变更', row, value);
  };

  // 处理添加
  const handleAdd = () => {
    console.log('添加调拨记录');
  };

  // 计算收货百分比
  const getReceiptPercentage = (row: TransferItem) => {
    const { stock_transfer_item_model_list } = row || { stock_transfer_item_model_list: [] };
    if (!stock_transfer_item_model_list) return '0%';
    let total = 0;
    stock_transfer_item_model_list.forEach(item => {
      total = retainDecimal8(total + item.transfer_in_quantity, 8);
    });
    return retainDecimal8((total / row.total_transfer_quantity) * 100, 2) + '%';
  };

  const crud = useCrud<TransferItem, TransferParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      query: inventoryTransferApi.getTransferList,
      drop: inventoryTransferApi.deleteTransfer
    }
  });

  return {
    ...crud,
    selectedRows,
    handleSelectionChange,
    handleDelete,
    handleEdit,
    handleDetail,
    handlePrint,
    handleStatusChange,
    handleReview,
    handleAdd,
    getStatusOptions,
    reviewOptions,
    getStatusInfo,
    getReceiptPercentage
  };
}
