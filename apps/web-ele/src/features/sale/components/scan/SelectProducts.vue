<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

import { ElDrawer, ElMessageBox } from '@igourd/common-ui';
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
  ElMessageBox.confirm(t('scan.deleteGoods'), t('scan.confirm'), {
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
  <div>
    <ElDrawer
      v-model="isProductsShow"
      class="bg-porcelain"
      :with-header="false"
      direction="rtl"
      size="86%"
      custom-class="coupon-drawer-prevent-send"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <div class="close86" @click="handleClose">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="drawer-container">
        <div class="drawer-title bg-white">
          <p class="title">
            {{ t('scan.select-product') }}&nbsp;&nbsp;
            <!-- <i
            class="iconfont icon-bangzhu"
          ></i> -->
          </p>
        </div>
        <div class="drawer-content mt-1">
          <div class="drawer-content-box">
            <el-row :gutter="5" class="h-full">
              <el-col :span="8" class="h-full">
                <el-scrollbar class="h-full">
                  <div class="drawer-content-left bg-white">
                    <!-- 挂单选择 -->
                    <div class="select-products-search-box">
                      <div class="select-products-search gap-2">
                        <el-input
                          ref="searchRef"
                          v-model="searchValue"
                          :clearable="true"
                          class="h-13"
                          :placeholder="
                            $t('scan.barcode-product-code-product-name')
                          "
                        >
                          <template #prefix>
                            <img
                              src="#/assets/img/longcode-s.png"
                              class="iconfont longcode"
                              :width="47"
                              :height="80"
                            />
                          </template>
                        </el-input>
                        <el-button
                          color="#0D99FF"
                          class="w-25 h-full text-white"
                          @click="handleSearchClick"
                        >
                          {{ t('scan.search') }}
                        </el-button>
                      </div>
                      <!-- 商品分类 -->
                      <div class="select-products-group">
                        <div class="select-products-group-list">
                          <div
                            v-for="(item, index) in productGroupFirstList"
                            :key="item.id"
                            class="select-products-group-item border-skyblue-light cursor-pointer border border-solid"
                            :class="
                              productGroupFirstId == item.id
                                ? 'select-products-group-item-active bg-azure text-white'
                                : 'bg-frost-white text-azure'
                            "
                            @click.stop="
                              getProductGroupList(item.id, $event, index)
                            "
                          >
                            {{ item.major_name }}
                          </div>
                        </div>
                        <!-- downLeft downTop -->
                        <div
                          v-if="downShow && productGroupList.length > 0"
                          class="triangle-up absolute"
                          :style="{
                            position: 'absolute',
                            left: `${IndicatorLeft - 6}px`,
                            top: `${downTop - 12}px`,
                          }"
                        ></div>
                        <div
                          v-show="downShow && productGroupList.length > 0"
                          ref="downRef"
                          class="select-products-group-down border-silver-mist border border-solid bg-white"
                          :style="{
                            left: `${downLeft}px`,
                            top: `${downTop}px`,
                          }"
                        >
                          <!-- IndicatorLeft -->
                          <div
                            v-for="item in productGroupList"
                            :key="item.id"
                            class="select-products-group-down-item text-dark-gray"
                            @click="handleProductGroupClick(item)"
                          >
                            {{ item.major_name }}
                          </div>
                        </div>
                        <div class="select-products-group-page-box">
                          <div
                            class="select-products-group-page"
                            :class="
                              pageNumFirst == 1
                                ? 'bg-light-silver text-steel-gray'
                                : 'bg-mint-frost text-apple-green'
                            "
                            @click="handlePageFirstClick('up')"
                          >
                            <!-- ArrowUpBoldIconColor, ArrowUpBoldIconColorActive -->
                            <el-icon
                              :color="pageNumFirst == 1 ? '#909399' : '#95D475'"
                            >
                              <ArrowUpBold />
                            </el-icon>
                          </div>
                          <!-- pageSumFirst.value == pageNumFirst.value -->
                          <div
                            class="select-products-group-page"
                            :class="
                              pageSumFirst == pageNumFirst
                                ? 'bg-light-silver text-steel-gray'
                                : 'bg-mint-frost text-apple-green'
                            "
                            @click="handlePageFirstClick('down')"
                          >
                            <el-icon
                              :color="
                                pageSumFirst == pageNumFirst
                                  ? '#909399'
                                  : '#95D475'
                              "
                            >
                              <ArrowDownBold />
                            </el-icon>
                          </div>
                        </div>
                      </div>
                      <!-- 商品列表 -->
                      <div
                        v-if="productList.length > 0"
                        class="select-products-list"
                      >
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
                          <p
                            class="select-products-item-price text-coral-bright"
                          >
                            ${{ productItem.selling_price }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="item-center flex justify-end">
                      <el-pagination
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
                </el-scrollbar>
              </el-col>
              <el-col :span="16" class="h-full">
                <div class="basic-details bg-white">
                  <div
                    class="basic-details-title border-b-solid border-b-gray-lightest border-b"
                  >
                    {{ t('scan.product_details') }}
                  </div>
                  <div class="take-table-box">
                    <!-- <el-table
                      header-row-class-name="take-table-header"
                      :header-row-style="{
                        backgroundColor: '#FAFCFF'
                      }"
                      :data="selectGoodList"
                    >
                      <template #empty>
                        <div class="flex items-center justify-center">
                          <div class="text-center">
                            <img src="../../../assets/img/table-empty.svg" alt="" />
                            <p>No data available</p>
                          </div>
                        </div>
                      </template>
                      <el-table-column :label="t('sale.columns.product')" prop="major_name">
                        <template #default="scope">
                          {{ scope.row.major_name || ''
                          }}{{ scope.row.product_spec_kvmessage ? '-' + scope.row.product_spec_kvmessage : '' }}
                        </template>
                      </el-table-column>
                      <el-table-column :label="t('sale.columns.unit')" prop="product_unit_name">
                        <template #default="scope">
                          <div>
                            <span
                              >{{ scope.row.product_unit_name }}
                              <el-icon class="el-icon--right">
                                <arrow-down />
                              </el-icon>
                            </span>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column :label="t('sale.columns.code')" prop="product_code"></el-table-column>
                      <el-table-column label="Qty" prop="sale_warehouse_product_stock_quantity" width="180">
                      </el-table-column>
                      <el-table-column :label="t('sale.columns.price')" prop="custom_price">
                        <template #default="scope">
                          <el-input v-model="scope.row.custom_price" type="number" :readonly="true">
                            <template #suffix>
                              <span>￥</span>
                            </template>
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column :label="t('sale.columns.warehouse')" width="150">
                        <template #default="scope">
                          <WareHouse :detail-info="scope.row"></WareHouse>
                        </template>
                      </el-table-column>
                    </el-table> -->
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
                    <span class="text-ocean-blue">Selected: {{ totalQuantity }}</span>
                    <div class="mt-1 flex items-center gap-2.5">
                      <el-button
                        v-auth="['sale_hold_product_delete']"
                        class="Sale-button text-watermelon"
                        color="#FEF0F0"
                        :name="t('common.Empty')"
                      >
                        {{ t('common.Empty') }}
                      </el-button>
                      <el-button
                        color="#0D99FF"
                        class="Sale-button text-white"
                        @click="handleProductConfirm"
                      >
                        {{ t('common.save_text') }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>
<style scoped lang="scss">
.longcode {
  height: 30px;
}

.drawer-content-box {
  width: 100%;
  height: calc(100vh - 90px);

  .drawer-content-left {
    padding: 10px 20px;
  }

  .basic-details {
    width: 100%;
    padding: 10px 20px;
    border-radius: 4px;

    .basic-details-title {
      display: flex;
      gap: 5px;
      align-items: center;
      padding-bottom: 2px;
      border-bottom: 1px solid #eee;

      &::before {
        clear: both;
        display: block;
        width: 4px;
        height: 10px;
        content: '';
        background: #0d99ff;
        border-radius: 4px;
      }
    }

    .basic-details-info {
      font-size: 14px;

      span {
        font-weight: 700;
      }
    }

    .order-table-header-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      background-color: #f5f7fa;

      .order-table-header-info-left {
        display: flex;
        gap: 10px;

        .icon {
          font-size: 12px;
        }
      }

      .order-table-header-info-time {
        font-weight: 700;
      }

      :last-child {
      }
    }

    .take-order-info {
    }
  }

  .select-products-search-box {
    box-sizing: border-box;
    height: auto;
    padding: 10px 4px;

    .select-products-search {
      display: flex;
      align-items: center;
      height: 52px;
    }
  }

  .select-products-group {
    position: relative;
    display: flex;
    margin-top: 11px;

    .select-products-group-down {
      position: absolute;
      bottom: -44px; // 调整位置，使其显示在父级分类下方
      left: 0;
      z-index: 10;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: fit-content;
      height: 68px;
      padding: 6px;
      overflow: auto;

      > div:nth-child(5n + 1) {
        padding-left: 0;

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 12px;
          content: '';
          background-color: transparent !important;
        }
      }

      .select-products-group-down-item {
        position: relative;
        width: 20%;
        height: 27px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 27px;
        text-align: center;
        white-space: nowrap;
        cursor: pointer;
        border-radius: 4px;

        &::before {
          position: absolute;
          top: 7px;
          left: 0;
          width: 2px;
          height: 12px;
          content: ' ';
          background-color: #dfdfdf;
        }

        &:hover {
          color: #fff;
          background-color: #0d99ff;
        }
      }
    }
  }

  .select-products-group-list {
    display: flex;
    //align-items: center;
    flex-wrap: wrap;
    width: 80%;
    // :nth-child(5n+1)

    .select-products-group-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25%;
      height: 44px;
      padding: 1rem;
      font-size: 12px;
      font-weight: 400;
      text-align: center;
    }
  }

  .select-products-list {
    display: flex;
    flex-wrap: wrap;
    gap: 11px;
    margin-top: 5px;

    .select-products-item {
      box-sizing: border-box;
      display: flex;
      gap: 5px;
      width: calc(50% - 6px);
      padding: 5px;
      font-size: 12px;
      box-shadow: 0 1px 6px 0 #d1e2ff;

      img {
        width: 48px;
        height: 48px;
      }
    }
  }

  .select-products-group-page-box {
    width: 20%;

    .select-products-group-page {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
    }
  }

  .select-products-item-img-box {
    width: 48px;
    height: 48px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .select-products-item {
    position: relative;

    .select-products-item-price {
      position: absolute;
      right: 4.5px;
      bottom: 4px;
    }
  }

  .take-table-box {
    height: calc(100vh - 175px);
  }
}

.close86 {
  z-index: 2399;
}
</style>
<style lang="scss">
.select-products {
  .product-stock-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 0 11px;
    border-radius: 4px;
    // background-color: #ffb9b9;
    // color: #ff6060;
  }
  // .product-stock {
  //   color: #ff6060;
  //   background-color: #ffb9b9;
  // }
  :deep(.el-input) {
    height: 100%;

    .el-input__wrapper {
      border-radius: 0;
    }

    .el-input-group__append {
      background-color: #f0f9ff;

      &:active {
        background-color: #d9efff;
      }
    }
  }
}
</style>
