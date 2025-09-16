import type { SpoilageItem, SpoilageParams } from '../../types/spoilage';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventorySpoilageApi } from '../../apis/spoilage';
import { useCrud } from '@/composables/useCrud';
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatNumber } from '@/common/functions';
import { retainDecimal8 } from '@/utils/eleValidate';

export function useInventorySpoilageList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<SpoilageItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
      selectable: (row) => row.status !== 'APPROVED' && row.status !== 'REJECTED'
    },
    {
      field: 'stock_consumption_no',
      title: t('inventory.stockConsumptionNo'),
      minWidth: 240,
      fixed: 'left'
    },
    {
      field: 'consumption_date',
      title: t('inventory.stockConsumptionDate'),
      minWidth: 240,
      sortable: true,
      formatter: ({ cellValue }) => cellValue ? cellValue.split(' ')[0] : ''
    },
    {
      field: 'total_spoilage_quantity',
      title: t('inventory.total_spoilage_quantity'),
      minWidth: 150,
      formatter: ({ cellValue }) => {
        return formatNumber(cellValue) && retainDecimal8(cellValue, 8);
      }
    },
    {
      field: 'warehouse_name',
      title: t('inventory.warehouse_name'),
      minWidth: 150
    },
    {
      field: 'consumption_reason',
      title: t('inventory.consumption_reason'),
      minWidth: 150,
      formatter: ({ cellValue }) => t(`inventory.${cellValue}`)
    },
    {
      field: 'status',
      title: t('inventory.review'),
      minWidth: 85,
      fixed: 'right',
      slots: { default: 'status' }
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
      minWidth: 135,
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
        placeholder: "{{t('inventory.pleaseEnterKeywordsToSearch')}}",
        clearable: true
      }
    },
    consumption_reason: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.consumption_reason')}}",
        clearable: true,
        options: [
          { label: t('inventory.EXPIRED'), value: 'EXPIRED' },
          { label: t('inventory.DAMAGED'), value: 'DAMAGED' },
          { label: t('inventory.LOST'), value: 'LOST' },
          { label: t('inventory.OTHER'), value: 'OTHER' }
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
          { label: t('inventory.PENDING'), value: 'PENDING' },
          { label: t('inventory.APPROVED'), value: 'APPROVED' },
          { label: t('inventory.REJECTED'), value: 'REJECTED' }
        ]
      }
    }
  };

  // 选中的行
  const selectedRows = ref<SpoilageItem[]>([]);

  // 处理选择变化
  const handleSelectionChange = (selection: SpoilageItem[]) => {
    selectedRows.value = selection;
  };

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
        t('inventory.confirmDeleteSelectedItems'),
        t('inventory.warning'),
        {
          confirmButtonText: t('inventory.confirm'),
          cancelButtonText: t('inventory.cancel'),
          type: 'warning'
        }
      );

      const res = await inventorySpoilageApi.deleteSpoilage({
        stock_consumption_ids: selectedRows.value.map(item => item.id),
        merchant_id: 1 // 这里应该从用户信息获取
      });

      if (res.code === 'SUCCESS') {
        ElMessage.success(t('inventory.deleteSuccessful'));
        // 刷新数据
        // 这里应该调用刷新方法
      } else {
        ElMessage.error(t('inventory.deleteFailed') + ': ' + res.message);
      }
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(t('inventory.deleteOperationFailed'));
      }
    }
  };

  // 处理编辑
  const handleEdit = (row: SpoilageItem) => {
    console.log('编辑损耗记录', row);
  };

  // 处理详情
  const handleDetail = (row: SpoilageItem) => {
    console.log('查看损耗详情', row);
  };

  // 处理打印
  const handlePrint = (row: SpoilageItem) => {
    console.log('打印损耗单', row);
  };

  // 处理审核
  const handleAudit = (row: SpoilageItem) => {
    console.log('审核损耗记录', row);
  };

  // 处理添加
  const handleAdd = () => {
    console.log('添加损耗记录');
  };

  const crud = useCrud<SpoilageItem, SpoilageParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      query: inventorySpoilageApi.getSpoilageList,
      drop: inventorySpoilageApi.deleteSpoilage
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
    handleAudit,
    handleAdd,
    getStatusInfo
  };
}
