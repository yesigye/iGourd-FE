import type { ProductSpecItem, ProductSpecValueItem, ProductSpecParams, ProductSpecValueParams } from '../../types/product-spec';
import { useI18n } from 'vue-i18n';
import { inventoryProductSpecApi } from '../../apis/product-spec';
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export function useInventoryProductSpec() {
  const { t } = useI18n();

  // 规格列表
  const productSpecList = ref<ProductSpecItem[]>([]);
  const productSpecValueList = ref<ProductSpecValueItem[]>([]);
  const selectedSpec = ref<number | null>(null);
  const keywords = ref('');

  // 分页参数
  const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    total: 0
  });

  // 规格列表参数
  const productSpecListParams = ref<ProductSpecParams>({
    page_num: 1,
    page_size: 1000,
    merchant_id: 1, // 这里应该从用户信息获取
    keywords: ''
  });

  // 规格值列表参数
  const productSpecValueListParams = ref<ProductSpecValueParams>({
    page_num: 1,
    page_size: 20,
    merchant_id: 1, // 这里应该从用户信息获取
    product_spec_id: 0,
    keywords: ''
  });

  // 获取规格列表
  const getProductSpecList = async () => {
    try {
      const response = await inventoryProductSpecApi.getProductSpecList(productSpecListParams.value);
      if (response.code === 'SUCCESS') {
        productSpecList.value = response.data.list || [];
      } else {
        ElMessage.error(response.message || t('inventory.product_spec.getSpecListFailed'));
      }
    } catch (error) {
      ElMessage.error(t('inventory.product_spec.getSpecListFailed'));
    }
  };

  // 获取规格值列表
  const getProductSpecValueList = async (specId: number) => {
    try {
      productSpecValueListParams.value.product_spec_id = specId;
      productSpecValueListParams.value.keywords = keywords.value.trim();
      
      const response = await inventoryProductSpecApi.getProductSpecValueList(productSpecValueListParams.value);
      if (response.code === 'SUCCESS') {
        productSpecValueList.value = response.data.list || [];
        pagination.value.total = response.data.total || 0;
      } else {
        ElMessage.error(response.message || t('inventory.product_spec.getSpecValueListFailed'));
      }
    } catch (error) {
      ElMessage.error(t('inventory.product_spec.getSpecValueListFailed'));
    }
  };

  // 删除规格
  const deleteSpec = async (spec: ProductSpecItem) => {
    try {
      await ElMessageBox.confirm(
        t('inventory.product_spec.confirm_delete_spec'),
        t('common.warning'),
        {
          confirmButtonText: t('common.confirmBtn'),
          cancelButtonText: t('common.cancelBtn'),
          type: 'warning'
        }
      );

      const response = await inventoryProductSpecApi.deleteProductSpec({
        id: spec.id,
        merchant_id: productSpecListParams.value.merchant_id
      });

      if (response.code === 'SUCCESS') {
        ElMessage.success(response.message || t('inventory.product_spec.deleteSpecSuccess'));
        await getProductSpecList();
      } else {
        ElMessage.error(response.message || t('inventory.product_spec.deleteSpecFailed'));
      }
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(t('inventory.product_spec.deleteSpecFailed'));
      }
    }
  };

  // 删除规格值
  const deleteSpecValue = async (specValue: ProductSpecValueItem) => {
    try {
      await ElMessageBox.confirm(
        t('inventory.product_spec.confirm_delete_spec_value'),
        t('common.warning'),
        {
          confirmButtonText: t('common.confirmBtn'),
          cancelButtonText: t('common.cancelBtn'),
          type: 'warning'
        }
      );

      const response = await inventoryProductSpecApi.deleteProductSpecValue({
        id: specValue.id,
        merchant_id: productSpecValueListParams.value.merchant_id
      });

      if (response.code === 'SUCCESS') {
        ElMessage.success(response.message || t('inventory.product_spec.deleteSpecValueSuccess'));
        await getProductSpecValueList(specValue.product_spec_id);
      } else {
        ElMessage.error(response.message || t('inventory.product_spec.deleteSpecValueFailed'));
      }
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(t('inventory.product_spec.deleteSpecValueFailed'));
      }
    }
  };

  // 处理规格选择
  const handleSpecSelect = (spec: ProductSpecItem) => {
    selectedSpec.value = spec.id;
    pagination.value.currentPage = 1;
    productSpecValueListParams.value.page_num = 1;
    getProductSpecValueList(spec.id);
  };

  // 搜索
  const search = () => {
    pagination.value.currentPage = 1;
    productSpecValueListParams.value.page_num = 1;
    productSpecValueListParams.value.keywords = keywords.value.trim();

    if (selectedSpec.value) {
      getProductSpecValueList(selectedSpec.value);
    }
  };

  // 清空搜索
  const clearSearch = () => {
    keywords.value = '';
    productSpecValueListParams.value.keywords = '';
    if (selectedSpec.value) {
      getProductSpecValueList(selectedSpec.value);
    }
  };

  // 分页处理
  const handleSizeChange = (size: number) => {
    pagination.value.pageSize = size;
    productSpecValueListParams.value.page_size = size;
    if (selectedSpec.value) {
      getProductSpecValueList(selectedSpec.value);
    }
  };

  const handleCurrentChange = (page: number) => {
    pagination.value.currentPage = page;
    productSpecValueListParams.value.page_num = page;
    if (selectedSpec.value) {
      getProductSpecValueList(selectedSpec.value);
    }
  };

  // 选择第一个规格
  const selectFirstSpec = () => {
    if (productSpecList.value && productSpecList.value.length > 0) {
      const firstSpec = productSpecList.value[0];
      handleSpecSelect(firstSpec);
    }
  };

  // 根据ID获取规格
  const getSpecById = (id: number) => {
    return productSpecList.value.find(spec => spec.id === id);
  };

  // 树形数据
  const treeData = computed(() => [
    {
      id: 'root',
      label: t('inventory.product_spec.product_spec'),
      isRoot: true,
      children: productSpecList.value.map(spec => ({
        id: spec.id,
        label: spec.product_spec_name,
        isRoot: false
      }))
    }
  ]);

  // 表格列配置
  const tableColumns = computed(() => [
    {
      prop: 'spec_value',
      label: t('inventory.product_spec.spec_value'),
      width: 200,
      minWidth: 150
    },
    {
      prop: 'spec_value_code',
      label: t('inventory.product_spec.spec_value_code'),
      width: 200,
      minWidth: 150
    },
    {
      prop: 'status',
      label: t('inventory.product_spec.status'),
      width: 120,
      slot: 'status'
    },
    {
      prop: 'creator_name',
      label: t('inventory.product_spec.creator'),
      width: 150,
      minWidth: 120
    },
    {
      prop: 'create_time',
      label: t('inventory.product_spec.create_time'),
      width: 180,
      minWidth: 150,
      formatter: (row: ProductSpecValueItem) => {
        return new Date(row.create_time).toLocaleString();
      }
    },
    {
      prop: 'operation',
      label: t('inventory.product_spec.action'),
      width: 150,
      slot: 'operate'
    }
  ]);

  onMounted(async () => {
    await getProductSpecList();
    selectFirstSpec();
  });

  return {
    // 数据
    productSpecList,
    productSpecValueList,
    selectedSpec,
    keywords,
    pagination,
    treeData,
    tableColumns,
    
    // 方法
    getProductSpecList,
    getProductSpecValueList,
    deleteSpec,
    deleteSpecValue,
    handleSpecSelect,
    search,
    clearSearch,
    handleSizeChange,
    handleCurrentChange,
    selectFirstSpec,
    getSpecById
  };
}
