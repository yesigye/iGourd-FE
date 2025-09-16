import type { SkuListItem, SkuListParams } from '../../types/sku-list';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventorySkuListApi } from '../../apis/sku-list';
import { useCrud } from '@/composables/useCrud';
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export function useInventorySkuList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<SkuListItem>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left'
    },
    {
      field: 'profile_photo',
      title: t('inventory.image'),
      minWidth: 80,
      fixed: 'left',
      slots: { default: 'image' }
    },
    {
      field: 'major_name',
      title: t('inventory.productName'),
      minWidth: 200,
      fixed: 'left'
    },
    {
      field: 'sku_barcode',
      title: t('inventory.sku_list.sku_barcode'),
      minWidth: 180
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 160
    },
    {
      field: 'spec_info',
      title: t('inventory.sku_list.spec_info'),
      minWidth: 200
    },
    {
      field: 'status',
      title: t('inventory.status'),
      minWidth: 120,
      slots: { default: 'status' }
    },
    {
      field: 'selling_price',
      title: t('inventory.sellingPrice'),
      minWidth: 120,
      formatter: ({ cellValue }) => cellValue ? `$${cellValue}` : '-'
    },
    {
      field: 'cost_price',
      title: t('inventory.costPrice'),
      minWidth: 120,
      formatter: ({ cellValue }) => cellValue ? `$${cellValue}` : '-'
    },
    {
      field: 'stock_quantity',
      title: t('inventory.stockQuantity'),
      minWidth: 120,
      formatter: ({ cellValue }) => cellValue || 0
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
      minWidth: 150,
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
        placeholder: "{{t('inventory.pleaseEnterKeywordsNameAndSku')}}",
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
          { label: t('inventory.onSale'), value: 'ON_SALE' },
          { label: t('inventory.offSale'), value: 'OFF_SALE' }
        ]
      }
    }
  };

  // 选中的行
  const selectedRows = ref<SkuListItem[]>([]);

  // 处理选择变化
  const handleSelectionChange = (selection: SkuListItem[]) => {
    selectedRows.value = selection;
  };

  // 处理删除
  const handleDelete = async () => {
    if (!selectedRows.value.length) {
      ElMessage.warning(t('inventory.pleaseSelectDeleteItem'));
      return;
    }

    // 检查是否为主单位商品
    if (selectedRows.value.some(item => item.is_basic)) {
      ElMessage.error(t('inventory.main_unit_product_tips'));
      return;
    }

    try {
      await ElMessageBox.confirm(
        t('inventory.stock_clear_propmt'),
        t('inventory.clearing'),
        {
          confirmButtonText: t('inventory.clearing'),
          cancelButtonText: t('inventory.cancel'),
          type: 'warning'
        }
      );

      const response = await inventorySkuListApi.deleteSku({
        merchant_id: 1, // 这里应该从用户信息获取
        product_info_ids: selectedRows.value.map(item => item.id)
      });

      if (response.code === 'SUCCESS') {
        // 检查是否需要额外确认
        if (response.data?.remove_check_enum) {
          await ElMessageBox.confirm(
            t(`inventory.delete_tips_${response.data.remove_check_enum.toLowerCase()}`),
            t('common.systeMmessage'),
            {
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }
          );
        }
        
        ElMessage.success(t('inventory.clear_success'));
        // 刷新数据
        // 这里应该调用刷新方法
      } else {
        ElMessage.error(response.message || t('inventory.deleteFailed'));
      }
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(t('inventory.deleteFailed'));
      }
    }
  };

  // 处理编辑
  const handleEdit = (row: SkuListItem) => {
    console.log('编辑SKU', row);
  };

  // 处理详情
  const handleDetail = (row: SkuListItem) => {
    console.log('查看SKU详情', row);
  };

  // 处理状态更新
  const handleStatusUpdate = async (row: SkuListItem, status: 'ON_SALE' | 'OFF_SALE') => {
    try {
      await inventorySkuListApi.updateSkuStatus({
        merchant_id: 1, // 这里应该从用户信息获取
        product_info_ids: [row.id],
        status
      });
      ElMessage.success(t('inventory.statusUpdateSuccess'));
    } catch (error) {
      ElMessage.error(t('inventory.statusUpdateFailed'));
    }
  };

  const crud = useCrud<SkuListItem, SkuListParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      query: inventorySkuListApi.getSkuList,
      drop: inventorySkuListApi.deleteSku
    }
  });

  return {
    ...crud,
    selectedRows,
    handleSelectionChange,
    handleDelete,
    handleEdit,
    handleDetail,
    handleStatusUpdate
  };
}
