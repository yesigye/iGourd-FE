import type { ProductListItem, ProductListParams } from '../../types/product-list';
import type { VxeGridPropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';
import { inventoryProductListApi } from '../../apis/product-list';
import { useCrud } from '@/composables/useCrud';
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export function useInventoryProductList() {
  const { t } = useI18n();

  const columns: VxeGridPropTypes.Column<ProductListItem>[] = [
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
      title: t('inventory.productNameMajor'),
      minWidth: 200,
      fixed: 'left'
    },
    {
      field: 'product_code',
      title: t('inventory.productCode'),
      minWidth: 160
    },
    {
      field: 'product_unit_names',
      title: t('inventory.unit'),
      minWidth: 110
    },
    {
      field: 'major_unit_name',
      title: t('inventory.major_unit_name'),
      minWidth: 110
    },
    {
      field: 'minor_name',
      title: t('inventory.minor_name'),
      minWidth: 200
    },
    {
      field: 'status',
      title: t('inventory.status'),
      minWidth: 110,
      slots: { default: 'status' }
    },
    {
      field: 'product_group_name',
      title: t('inventory.productGroup'),
      minWidth: 200,
      slots: { default: 'productGroup' }
    },
    {
      field: 'product_label_list',
      title: t('inventory.productLabel'),
      minWidth: 280,
      slots: { default: 'productLabel' }
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
      minWidth: 170,
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
        placeholder: "{{t('inventory.pleaseEnterKeywordsToSearchProductNameProductCode')}}",
        clearable: true
      }
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('inventory.saleStatus')}}",
        clearable: true,
        options: [
          { label: t('inventory.onSale'), value: 'ON_SALE' },
          { label: t('inventory.offSale'), value: 'OFF_SALE' }
        ]
      }
    }
  };

  // 状态列表
  const statusList = [
    { id: 1, label: t('inventory.onSale'), value: 'ON_SALE' },
    { id: 2, label: t('inventory.offSale'), value: 'OFF_SALE' }
  ];

  // 选中的行
  const selectedRows = ref<ProductListItem[]>([]);
  const selectedIds = ref<number[]>([]);

  // 处理选择变化
  const handleSelectionChange = (selection: ProductListItem[]) => {
    selectedRows.value = selection;
    selectedIds.value = selection.map(item => item.id);
  };

  // 处理删除
  const handleDelete = async () => {
    if (!selectedRows.value.length) {
      ElMessage.warning(t('customers.pleaseSelectTheDeleteItem'));
      return;
    }

    try {
      // 预检查删除
      const preCheckResult = await inventoryProductListApi.preCheckDelete({
        merchant_id: 1, // 这里应该从用户信息获取
        product_profile_ids: selectedIds.value
      });

      if (preCheckResult.code === 'SUCCESS') {
        if (preCheckResult.data?.remove_check_enum === null) {
          // 可以直接删除
          await inventoryProductListApi.deleteProduct({
            merchant_id: 1,
            product_profile_ids: selectedIds.value
          });
          ElMessage.success(t('inventory.deleteSuccess'));
        } else {
          // 需要确认删除
          await ElMessageBox.confirm(
            t(`inventory.delete_tips_${preCheckResult.data?.remove_check_enum?.toLowerCase()}`),
            t('common.systeMmessage'),
            {
              type: 'warning',
              dangerouslyUseHTMLString: true
            }
          );
          
          await inventoryProductListApi.deleteProduct({
            merchant_id: 1,
            product_profile_ids: selectedIds.value,
            remove_check_enum: preCheckResult.data?.remove_check_enum
          });
          ElMessage.success(t('inventory.deleteSuccess'));
        }
      } else {
        ElMessage.error(preCheckResult.message || t('inventory.deleteFailed'));
      }
    } catch (error) {
      ElMessage.error(t('inventory.deleteFailed'));
    }
  };

  // 处理复制
  const handleCopy = async (row: ProductListItem) => {
    try {
      await inventoryProductListApi.copyProduct({
        id: row.id,
        merchant_id: 1 // 这里应该从用户信息获取
      });
      ElMessage.success(t('common.copySucc'));
    } catch (error) {
      ElMessage.error(t('inventory.copyFailed'));
    }
  };

  // 处理标签绑定
  const handleLabelBind = async (productId: number, labelIds: number[]) => {
    try {
      await inventoryProductListApi.bindProductLabel({
        product_id: productId,
        label_id_list: labelIds,
        merchant_id: 1 // 这里应该从用户信息获取
      });
      ElMessage.success(t('inventory.labelBindSuccess'));
    } catch (error) {
      ElMessage.error(t('inventory.labelBindFailed'));
    }
  };

  // 处理导入
  const handleImport = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await inventoryProductListApi.importProducts(formData);
      ElMessage.success(t('inventory.importSuccess'));
    } catch (error) {
      ElMessage.error(t('inventory.importFailed'));
    }
  };

  // 处理导出
  const handleExport = async () => {
    try {
      const response = await inventoryProductListApi.exportProducts({
        ids: selectedIds.value,
        conditionParams: {} // 这里应该传入实际的查询参数
      });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('inventory.productList')}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      ElMessage.success(t('inventory.exportSuccess'));
    } catch (error) {
      ElMessage.error(t('inventory.exportFailed'));
    }
  };

  const crud = useCrud<ProductListItem, ProductListParams>({
    columns,
    searchFormSchema,
    batchOperate: true,
    service: {
      query: inventoryProductListApi.getProductSKUList,
      drop: inventoryProductListApi.deleteProduct
    }
  });

  return {
    ...crud,
    statusList,
    selectedRows,
    selectedIds,
    handleSelectionChange,
    handleDelete,
    handleCopy,
    handleLabelBind,
    handleImport,
    handleExport
  };
}
