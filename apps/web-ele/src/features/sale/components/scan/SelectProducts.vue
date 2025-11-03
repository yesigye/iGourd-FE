<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

import {
  ElButton,
  ElCol,
  ElInput,
  ElMessageBox,
  ElPagination,
  ElRow,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  productGroupFirstPageListApi,
  productGroupSecondPageListApi,
  productSearchApi,
} from '@@/sale/apis';
import SelectProductsable from '@@/sale/components/scan/SelectProductsable.vue';
import { useInfiniteScroll } from '@vueuse/core';

const props = defineProps({
  drawerReturnShow: {
    type: Boolean,
    default: false,
  },
  drawerReturnTitle: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '',
  },
});
const emit = defineEmits([
  'close-tkr',
  'handleTakeOrderInfo',
  'calculationBadgeCount',
  'confirm',
]);
const [Drawer, drawerApi] = useIgourdDrawer();
const { t } = useI18n();

const isProductsShow = ref(false);
const productGroupFirstList = ref([]);
const productGroupFirstId = ref('');
const pageNumFirst = ref(1);
const pageSumFirst = ref(0);
const pageSizeFirst = ref(8);
const productGroupFirstTotal = ref(0);
const searchValue = ref('');
const searchSize = ref(12);
const searchNum = ref(1);
const productList = ref([]);
const selectGoodList = ref([]);
const productListTotal = ref(0);
// 使用计算属性 计算总数量
const totalQuantity = computed(() => {
  return selectGoodList.value.reduce((pre, cur) => {
    return pre + cur.sale_warehouse_product_stock_quantity;
  }, 0);
});
function handleRowClick(row) {
  openSelectWarehouseModalList(true, { row });
}
const handleUpdateQuantity = (updatedItem, newProduct) => {
  console.log('handleUpdateQuantity', updatedItem, newProduct);
  // 更新商品列表中对应商品的数量
  const index = selectGoodList.value.findIndex(
    (item) => item.id === updatedItem.id,
  );
  if (index !== -1) {
    selectGoodList.value[index].custom_price = updatedItem.custom_price;
    selectGoodList.value[index].selling_price = updatedItem.selling_price;

    selectGoodList.value[index].stock_total_quantity =
      updatedItem.stock_total_quantity;

    selectGoodList.value[index].sale_warehouse_product_stock_quantity_message =
      updatedItem.sale_warehouse_product_stock_quantity_message;
    selectGoodList.value[index].sale_warehouse_product_stock_quantity =
      updatedItem.sale_warehouse_product_stock_quantity;
  }
};
const handleUpdateUnit = (updatedItem, newProduct, existingProduct) => {
  if (existingProduct) {
    const index = selectGoodList.value.findIndex(
      (item) => item.id === updatedItem.id,
    );
    if (index !== -1) {
      const quantityToAdd = selectGoodList.value[index].stock_total_quantity;
      selectGoodList.value.splice(index, 1);

      const existingIndex = selectGoodList.value.findIndex(
        (item) => item.id === existingProduct.id,
      );
      if (existingIndex !== -1) {
        selectGoodList.value[existingIndex].stock_total_quantity +=
          quantityToAdd;
      }
    }
  } else {
    const index = selectGoodList.value.findIndex(
      (item) => item.id === updatedItem.id,
    );
    if (index !== -1) {
      selectGoodList.value[index].custom_price = updatedItem.custom_price;
      selectGoodList.value[index].stock_total_quantity =
        updatedItem.stock_total_quantity;
      selectGoodList.value[
        index
      ].sale_warehouse_product_stock_quantity_message =
        updatedItem.sale_warehouse_product_stock_quantity_message;
      if (newProduct != null && newProduct != undefined) {
        selectGoodList.value[index] = {
          ...newProduct,
          stock_total_quantity: 1,
          custom_price: newProduct.selling_price,
          warehouse_id:
            updatedItem.sale_warehouse_id || updatedItem.warehouse_id,
          warehouse_name:
            updatedItem.sale_warehouse_name || updatedItem.warehouse_name,
          sale_warehouse_id:
            updatedItem.sale_warehouse_id || updatedItem.warehouse_id,
          sale_warehouse_name:
            updatedItem.sale_warehouse_name || updatedItem.warehouse_name,
          sale_warehouse_product_stock_quantity:
            updatedItem.sale_warehouse_product_stock_quantity,
          sale_warehouse_product_stock_quantity_message:
            updatedItem.sale_warehouse_product_stock_quantity_message,
          sub_product_stock_search_models:
            updatedItem.sub_product_stock_search_models,
        };
      }
    }
  }
};
// 删除商品 清空数量 重新计算订单价格
const handleDeleteGoods = (goodsId) => {
  // 是否要删除
  ElMessageBox.confirm(t('scan.delete-goods'), t('scan.confirm'), {
    confirmButtonText: t('scan.yes'),
    cancelButtonText: t('scan.no'),
  }).then(() => {
    selectGoodList.value = selectGoodList.value.filter(
      (item) => item.id !== goodsId,
    );
  });
};
// 搜索商品
const handleSearchClick = async () => {
  const res = await productSearchApi({
    business_type: 'SALE',
    keywords: searchValue.value,
    page_num: searchNum.value,
    page_size: searchSize.value,
    product_group_id: productGroupId.value,
  });
  // if (res.code === 'SUCCESS') {
  productList.value = res.list;
  productListTotal.value = Number(res.total);
  // }
};
const handleCurrentChange = (event) => {
  searchNum.value = event;
  handleSearchClick();
};
// 获取父级分类列表
const getProductGroupFirstList = async () => {
  const res = await productGroupFirstPageListApi({
    page_num: pageNumFirst.value,
    page_size: pageSizeFirst.value,
  });
  // if (res.code === 'SUCCESS') {
  productGroupFirstList.value = res.list;
  productGroupFirstTotal.value = res.total;
  pageSumFirst.value = Math.ceil(
    productGroupFirstTotal.value / pageSizeFirst.value,
  );
  // }
};

// 父级分类分页
const handlePageFirstClick = (type) => {
  if (type === 'up') {
    if (pageNumFirst.value <= 1) {
      return;
    }
    pageNumFirst.value--;
    getProductGroupFirstList();
  } else {
    // 根据总条数计算总页数，如果到达最后一页hou，则不加一
    if (pageSumFirst.value == pageNumFirst.value) return false;
    pageNumFirst.value++;
    getProductGroupFirstList();
  }
};

// 获取子级分类
const productGroupList = ref([]);
const productGroupId = ref('');
const pageNum = ref(1);
const pageSize = ref(20);
const downLeft = ref(0);
const downTop = ref(0);
const downShow = ref(false);
const IndicatorLeft = ref(0);
const productGroupTotal = ref(0);
const closeDown = () => {
  downShow.value = false;
};
const getProductGroupList = async (id, event, index) => {
  let height = 0;
  height = index <= 3 ? 54 : 98;
  IndicatorLeft.value = 44 * (index + 1) + 14;
  downLeft.value = 0;
  downTop.value = height;
  if (id === productGroupFirstId.value) {
    productGroupFirstId.value = '';
    productGroupId.value = '';
    downShow.value = false;
    handleSearchClick();
    return;
  } else {
    productGroupFirstId.value = id;
    pageNum.value = 1;
  }
  const res = await productGroupSecondPageListApi({
    page_num: pageNum.value,
    page_size: pageSize.value,
    parent_id: productGroupFirstId.value,
  });
  // if (res.code === 'SUCCESS') {
  productGroupList.value = res.list;
  productGroupTotal.value = res.total;
  downShow.value = true;
  // }
};
const downRef = useTemplateRef('downRef');

const { reset } = useInfiniteScroll(
  downRef,
  async () => {
    // load more
    // data.value.push(...moreData)
    if (productGroupList.value.length < productGroupTotal.value) {
      const res = await productGroupSecondPageListApi({
        page_num: pageNum.value,
        page_size: pageSize.value,
        parent_id: productGroupFirstId.value,
      });
      if (res[0]) {
        productGroupList.value = res[0].list;
        productGroupTotal.value = res[0].total;
        downShow.value = true;
      }
    }
  },
  {
    distance: 2,
    canLoadMore: () => {
      // inidicate when there is no more content to load so onLoadMore stops triggering
      // if (noMoreContent) return false
      return true; // for demo purposes
    },
  },
);
const handleProductGroupClick = (item) => {
  productGroupId.value = item.id;
  downShow.value = false;
  handleSearchClick();
};
// 选择商品
const handleProductClick = (productItem) => {
  // 如果已有相同商品数量加一
  const index = selectGoodList.value.findIndex(
    (item) => item.id === productItem.id,
  );
  if (index == -1) {
    selectGoodList.value.push({
      ...productItem,
      sale_warehouse_product_stock_quantity: 1,
      custom_price: productItem.selling_price,
    });
  } else {
    selectGoodList.value[index].sale_warehouse_product_stock_quantity++;
  }
};
// 保存商品
const handleProductConfirm = () => {
  selectGoodList.value.forEach((item) => {
    item.selling_price = item.custom_price;
  });
  emit('confirm', selectGoodList.value);
  isProductsShow.value = false;
  selectGoodList.value = [];
};
// 清空选择的商品
const clearSelected = () => {
  selectGoodList.value = [];
};
// 编辑数量弹
const changeInputNumber = (row) => {
  if (row.sale_warehouse_product_stock_quantity <= 0) {
    const index = selectGoodList.value.findIndex((item) => item.id === row.id);
    selectGoodList.value.splice(index, 1);
  }
};

const handleClose = () => {
  isProductsShow.value = false;
  emit('close-tkr');
};
watch(
  () => props.drawerReturnShow,
  (val) => {
    if (val) {
      isProductsShow.value = true;
      handleSearchClick();
      getProductGroupFirstList();
      // fetchOrderSuspendList();
    }
  },
);
onMounted(() => {});
</script>
<template>
  <Drawer>
    <ElRow :gutter="10" class="h-full">
      <ElCol :span="16" class="bg-primary h-full">
        <div class="basic-details bg-white">
          <div class="take-table-box">
            <SelectProductsable
              ref="scanContentRef"
              :merge-goods-list="selectGoodList"
              style="height: 100%; overflow-y: auto"
              @update-quantity="handleUpdateQuantity"
              @update-unit="handleUpdateUnit"
              @handle-select-row="handleSelectRow"
              @delete-goods="handleDeleteGoods"
            />
          </div>
          <div class="flex items-center justify-between pl-2 pr-2">
            <span class="text-ocean-blue"
              >Selected: {{ total - quantity || 0 }}</span
            >
            <div class="mt-1 flex items-center gap-2.5">
              <ElButton
                v-auth="['sale_hold_product_delete']"
                class="Sale-button text-watermelon"
                color="#FEF0F0"
                :name="t('common.Empty')"
              >
                {{ t('common.empty') }}
              </ElButton>
              <ElButton
                color="#0D99FF"
                class="Sale-button text-white"
                @click="handleProductConfirm"
              >
                {{ t('common.save-text') }}
              </ElButton>
            </div>
          </div>
        </div>
      </ElCol>
      <ElCol :span="8" class="h-full">
        <section class="flex h-full w-full gap-2.5 p-2.5">
          <div class="flex h-full flex-1 flex-col">
            <!-- 挂单选择 -->
            <div class="flex-shrink-0">
              <div class="flex items-center gap-2">
                <ElInput
                  ref="searchRef"
                  v-model="searchValue"
                  :clearable="true"
                  class="h-13 flex-1"
                  :placeholder="$t('scan.barcode-product-code-product-name')"
                />
                <ElButton
                  type="primary"
                  class="w-25 text-white"
                  @click="handleSearchClick"
                >
                  {{ t('scan.search') }}
                </ElButton>
              </div>
            </div>

            <!-- 商品列表 -->
            <div class="select-products-list flex-1 overflow-y-auto">
              <div
                v-for="productItem in productList"
                :key="productItem.id"
                class="select-products-item cursor-pointer"
                @click="handleProductClick(productItem)"
              >
                <div class="select-products-item-img-box">
                  <img
                    v-if="productItem.profile_photo"
                    :src="productItem.profile_photo"
                    class="select-products-item-img"
                    alt=""
                  />
                </div>
                <div class="select-products-item-box">
                  <p class="select-products-item-name">
                    {{ productItem.major_name || ''
                    }}{{
                      productItem.product_spec_kvmessage
                        ? `-${productItem.product_spec_kvmessage}`
                        : ''
                    }}
                  </p>
                  <p class="select-products-item-code">
                    {{ productItem.product_code || '' }}
                  </p>
                </div>
                <p class="select-products-item-price text-coral-bright">
                  ${{ productItem.selling_price }}
                </p>
              </div>
            </div>
            <div class="flex flex-shrink-0 justify-end">
              <ElPagination
                size="small"
                background
                layout="prev, pager, next"
                :total="productListTotal"
                :default-page-size="12"
                class="mt-4"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
          <!-- 商品分类 -->
          <div
            class="select-products-group border-primary w-[100px] flex-shrink-0 border-t border-solid"
          >
            <div
              class="text-primary border-primary box-border flex h-[44px] w-[100px] cursor-pointer items-center justify-center border border-t-0 border-solid p-2.5 text-sm"
            >
              全部
            </div>
          </div>
        </section>
      </ElCol>
    </ElRow>
  </Drawer>
</template>
