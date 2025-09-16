import type { UnitItem, UnitParams } from '../../types/unit';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventoryUnitApi } from '../../apis/unit';
import { useCrud } from '@/composables/useCrud';
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Check, Close } from '@element-plus/icons-vue';

export function useInventoryUnitList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<UnitItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
      selectable: (row) => row.source_type !== 'SYSTEM'
    },
    {
      field: 'unit_name',
      title: t('inventory.unitName'),
      minWidth: 150,
      fixed: 'left'
    },
    {
      field: 'unit_code',
      title: t('inventory.unitCode'),
      minWidth: 120
    },
    {
      field: 'unit_symbol',
      title: t('inventory.unitSymbol'),
      minWidth: 100
    },
    {
      field: 'is_basic_unit',
      title: t('inventory.isBasicUnit'),
      minWidth: 120,
      align: 'center',
      slots: { default: 'isBasicUnit' }
    },
    {
      field: 'conversion_ratio',
      title: t('inventory.conversionRatio'),
      minWidth: 120,
      formatter: ({ cellValue }) => cellValue ? cellValue.toString() : '-'
    },
    {
      field: 'basic_unit_name',
      title: t('inventory.basicUnitName'),
      minWidth: 150
    },
    {
      field: 'status',
      title: t('inventory.status'),
      minWidth: 120,
      align: 'center',
      slots: { default: 'status' }
    },
    {
      field: 'source_type',
      title: t('inventory.sourceType'),
      minWidth: 120,
      formatter: ({ cellValue }) => {
        const typeMap = {
          SYSTEM: t('inventory.system'),
          CUSTOM: t('inventory.custom')
        };
        return typeMap[cellValue] || cellValue;
      }
    },
    {
      field: 'creator_name',
      title: t('inventory.creator'),
      minWidth: 150
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
      minWidth: 85,
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
        placeholder: "{{t('inventory.unitSearchPlaceholder')}}",
        clearable: true
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
          { label: t('inventory.active'), value: 'ACTIVE' },
          { label: t('inventory.frozen'), value: 'FROZEN' },
          { label: t('inventory.init'), value: 'INIT' }
        ]
      }
    },
    source_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.sourceType')}}",
        clearable: true,
        options: [
          { label: t('inventory.system'), value: 'SYSTEM' },
          { label: t('inventory.custom'), value: 'CUSTOM' }
        ]
      }
    },
    is_basic_unit: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.isBasicUnit')}}",
        clearable: true,
        options: [
          { label: t('inventory.yes'), value: true },
          { label: t('inventory.no'), value: false }
        ]
      }
    }
  };

  // 选中的行
  const selectedRows = ref<UnitItem[]>([]);

  // 处理选择变化
  const handleSelectionChange = (selection: UnitItem[]) => {
    selectedRows.value = selection;
  };

  // 处理状态切换
  const handleStatusChange = async (row: UnitItem) => {
    const newStatus = row.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
    
    try {
      await inventoryUnitApi.updateUnitStatus({
        id: row.id,
        status: newStatus,
        merchant_id: 1 // 这里应该从用户信息获取
      });
      
      row.status = newStatus;
      ElMessage.success(t('inventory.statusUpdateSuccess'));
    } catch (error) {
      ElMessage.error(t('inventory.statusUpdateFailed'));
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
        t('inventory.confirmDeleteSelectedUnits'),
        t('inventory.warning'),
        {
          confirmButtonText: t('inventory.confirm'),
          cancelButtonText: t('inventory.cancel'),
          type: 'warning'
        }
      );

      const res = await inventoryUnitApi.deleteUnit({
        product_unit_id_list: selectedRows.value.map(item => item.id),
        merchant_id: 1 // 这里应该从用户信息获取
      });

      if (res.code === 'SUCCESS') {
        ElMessage.success(t('inventory.deleteSuccess'));
        // 刷新数据
        // 这里应该调用刷新方法
      } else {
        ElMessage.error(t('inventory.deleteFailed'));
      }
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.info(t('inventory.cancelDelete'));
      }
    }
  };

  // 处理编辑
  const handleEdit = (row: UnitItem) => {
    console.log('编辑单位', row);
  };

  // 处理添加
  const handleAdd = () => {
    console.log('添加单位');
  };

  // 检查单位是否可编辑
  const isEditable = (row: UnitItem) => {
    return row.source_type !== 'SYSTEM';
  };

  // 检查单位是否可选择
  const isSelectable = (row: UnitItem) => {
    return row.source_type !== 'SYSTEM';
  };

  const crud = useCrud<UnitItem, UnitParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      query: inventoryUnitApi.getUnitList,
      drop: inventoryUnitApi.deleteUnit
    }
  });

  return {
    ...crud,
    selectedRows,
    handleSelectionChange,
    handleStatusChange,
    handleDelete,
    handleEdit,
    handleAdd,
    isEditable,
    isSelectable,
    Check,
    Close
  };
}
