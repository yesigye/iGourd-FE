import { ref } from 'vue';

import { productSpecListApi, productSpecValueListApi } from '@@/inventory/apis';

export const useProductSKU = () => {
  // 商品规格列表数据
  const productSpecList = ref([]);

  // 商品规格值列表数据
  const productSpecValueList = ref([]);

  // 分页数据
  const pagination = ref({
    currentPage: 1,
    pageSize: 20, //
    pageSizes: [20, 30, 50, 100],
    total: 0,
  });

  // 规格值列表参数
  const productSpecValueListParams = ref({
    page_num: pagination.value.currentPage - 1,
    page_size: pagination.value.pageSize,
    product_spec_id: '',
  });

  // 规格列表参数
  const productSpecListParams = ref({
    product_spec_name: '',
    keywords: '',
  });

  // 获取商品规格值列表
  const getProductSpecValueList = async (id, type) => {
    try {
      productSpecValueListParams.value.product_spec_id = id;
      const res = await productSpecValueListApi(
        productSpecValueListParams.value,
      );
      productSpecValueList.value = res.list || [];
      pagination.value.total = res.total || 0;
      return res.list.filter((item) =>
        type == 'close' ? item.status !== 'CLOSED' : item,
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // 获取商品规格列表
  const getProductSpecList = async (keywords = '') => {
    productSpecListParams.value.keywords = keywords;
    try {
      const res = await productSpecListApi(productSpecListParams.value);
      productSpecList.value = res;
    } catch (error) {
      console.error(error);
    }
  };

  // 分页处理函数
  const handleSizeChange = (size) => {
    pagination.value.pageSize = size;
    productSpecValueListParams.value.page_size = size;
    if (productSpecValueListParams.value.product_spec_id) {
      getProductSpecValueList(productSpecValueListParams.value.product_spec_id);
    }
  };

  const handleCurrentChange = (page) => {
    pagination.value.currentPage = page;
    productSpecValueListParams.value.page_num = page;
    console.log('page', productSpecValueListParams.value.page_num);

    if (productSpecValueListParams.value.product_spec_id) {
      getProductSpecValueList(productSpecValueListParams.value.product_spec_id);
    }
  };

  return {
    productSpecList,
    productSpecValueList,
    pagination,
    productSpecValueListParams,
    productSpecListParams,
    getProductSpecValueList,
    getProductSpecList,
    handleSizeChange,
    handleCurrentChange,
  };
};
