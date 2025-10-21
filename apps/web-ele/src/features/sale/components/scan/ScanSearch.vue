<script lang="ts" setup>
import { computed, nextTick, reactive, ref, toRefs, watch } from 'vue';

import { ElAutocomplete, ElButton, ElMessage } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { debounce } from '@igourd/utils';

import { productSearchApi } from '@@/sale/apis';
// import TakeDetail from './TakeDetail.vue';
import { useTakeDetail } from '@@/sale/hooks';
import { storeToRefs } from 'pinia';

import codeIcon from '#/assets/sale/longcode-s.png';
import { useSetStore } from '#/store/sale/setStore';
import { thousandSeparator } from '#/utils/sale';

const props = defineProps({
  rowSelection: {
    type: Object,
    default: () => ({}),
  },
  isSuspendSuccess: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  'handleHangOrder:show',
  'handlePickOrder',
  'handleSelectCustomer',
  'handleGoods',
  'updateGoodsList',
  'refresh',
  'refreshCalculationBadgeCount',
  'productAdded',
]);
const { Drawer: takeDetail, drawerApi: drawerApiTakeDetail } = useTakeDetail();
const { setInfo } = storeToRefs(useSetStore());

const { t } = useI18n();
// data
const state = reactive({
  searchValue: '',
  readonly: false,
  selectGoods: null,
  filteredGoodsList: [],
  dialogVisible: false,
  isShowDialog: false,
  takeDetailRef: null,
  badgeCount: 0,
  inputValue: '',
  inputText: '',
  accumulatedInput: '',
  takeTitle: '',
  productList: [] as any[],
});
const {
  searchValue,
  readonly,
  selectGoods,
  isShowDialog,
  takeDetailRef,
  badgeCount,
  inputValue,
  accumulatedInput,
  takeTitle,
  productList,
} = toRefs(state);
const autocompleteRef = ref();

// 如果不可以超卖且库存为0，则显示红色
const isLessZeroProhibited = computed(() => {
  if (setInfo.value.isLessZeroProhibited) {
    return 'show-red';
  }
  return '';
});

// 失去焦点时，聚焦输入框
function handleBlur() {
  focus();
}

// 聚焦时设置延时300毫秒，在放开键盘之前，将readonly设置为false，解除禁止输入
function readonlyBlack() {
  const timer = setTimeout(() => {
    readonly.value = false;
    clearTimeout(timer);
  }, 0);
}

// 聚焦时会触发回调
function handleFocus() {
  readonlyBlack();
}

// 是否超卖
function isStockLessThanZero(item: any) {
  if (
    item.sale_warehouse_product_stock_quantity <= 0 &&
    item.is_basic &&
    isLessZeroProhibited.value
  ) {
    ElMessage.warning(t('scan.stock-less-than-zero'));
    return true;
  }
  return false;
}

// 获取所有在售的SKU
function getOnSaleSkus(item: any) {
  const onSaleSkus = [];
  const addedIds = new Set();

  // 收集所有在售的商品（主商品和子商品）
  function collectOnSaleProducts(product) {
    if (product.status === 'ON_SALE' && !addedIds.has(product.id)) {
      onSaleSkus.push(product);
      addedIds.add(product.id);
    }

    if (
      product.sub_product_stock_search_models &&
      product.sub_product_stock_search_models.length > 0
    ) {
      product.sub_product_stock_search_models.forEach((subProduct) => {
        if (subProduct.status === 'ON_SALE' && !addedIds.has(subProduct.id)) {
          onSaleSkus.push(subProduct);
          addedIds.add(subProduct.id);
        }
      });
    }
  }

  // 收集所有在售商品
  collectOnSaleProducts(item);

  // 保留原始sub_product_stock_search_models结构并确保所有商品都能访问到对应变体
  const originalRelationships = new Map();

  // 先存储原始关系
  if (
    item.sub_product_stock_search_models &&
    item.sub_product_stock_search_models.length > 0
  ) {
    originalRelationships.set(item.id, [
      ...item.sub_product_stock_search_models,
    ]);

    // 为子商品也保存原始关系
    item.sub_product_stock_search_models.forEach((subProduct) => {
      if (
        subProduct.sub_product_stock_search_models &&
        subProduct.sub_product_stock_search_models.length > 0
      ) {
        originalRelationships.set(subProduct.id, [
          ...subProduct.sub_product_stock_search_models,
        ]);
      }
    });
  }

  // 确保每个在售商品能够访问所有相关变体
  if (onSaleSkus.length > 0) {
    onSaleSkus.forEach((product) => {
      // 如果有原始关系，使用过滤后的原始关系，否则使用所有在售SKU
      if (originalRelationships.has(product.id)) {
        const originalSubs = originalRelationships.get(product.id);
        product.sub_product_stock_search_models = originalSubs.filter(
          (sub) =>
            sub.status === 'ON_SALE' && onSaleSkus.some((s) => s.id === sub.id),
        );
      } else {
        // 没有原始关系，则包含所有在售SKU（包括自己）
        product.sub_product_stock_search_models = [...onSaleSkus];
      }
    });
  }

  return onSaleSkus;
}

function handleSelect(item: any) {
  if (item.isHeader) return;
  searchValue.value = '';
  if (isStockLessThanZero(item)) {
    return;
  }

  // 检查商品是否有在售的SKU并获取所有在售SKU
  const onSaleSkus = getOnSaleSkus(item);
  if (!onSaleSkus || onSaleSkus.length === 0) {
    ElMessage.warning(t('scan.product-off-sale'));
    return;
  }

  // 优先选择主商品，如果主商品下架则选择第一个可用的变体
  let selectedProduct = null;

  // 检查主商品是否可用（在售）
  if (item.status === 'ON_SALE') {
    selectedProduct = item;
  } else {
    // 主商品不可用，选择第一个可用的变体
    selectedProduct = onSaleSkus[0];
  }

  // 只添加选中的单个商品
  if (selectedProduct) {
    emit('handleGoods', selectedProduct);
  }

  closePopper();
}

const openPopper = () => {
  nextTick(() => {
    autocompleteRef.value.popperRef.onOpen();
  });
};

const closePopper = () => {
  autocompleteRef.value.suggestions = [];
  nextTick(() => {
    autocompleteRef.value.popperRef.onClose();
  });
};

const handleHangOrder = () => {
  emit('handleHangOrder:show');
};

const handlePickOrder = () => {
  drawerApiTakeDetail.open();
};

const handleTakeOrder = async (selectedOrder) => {
  emit('updateGoodsList', selectedOrder);
};

const handleSelectCustomer = () => {
  emit('handleSelectCustomer');
};

const handleCalculationBadgeCount = (val) => {
  if (val) {
    badgeCount.value = Math.max(0, badgeCount.value - 1);
  }
};

// const handleEnterFirstProduct = () => {
//   if (productList.value.length && !isStockLessThanZero(productList.value[0])) {
//     return handleSelect(productList.value[0]);
//   }
// };

async function getQueryProduct() {
  try {
    autocompleteRef.value.loading = true;
    const res = await productSearchApi({
      keywords: searchValue.value,
      business_type: 'SALE',
      // status: 'ON_SALE',
      page_num: 1,
      page_size: 100,
    });
    return res?.list || [];
  } finally {
    autocompleteRef.value.loading = false;
  }
}

const handleEnterKey = async () => {
  if (searchValue.value) {
    productList.value = await getQueryProduct();
    if (productList.value?.length) {
      autocompleteRef.value.suggestions = [
        { isHeader: true },
        ...productList.value,
      ];
      openPopper();
      return;
    }
    searchValue.value = '';
  }
};

const handleEnterKeyDebounced = debounce(handleEnterKey, 500);

const handleClose = () => {
  drawerApiTakeDetail.close();
};

watch(selectGoods, (newVal) => {
  if (!newVal) {
    accumulatedInput.value = '';
    inputValue.value = '';
  }
});

watch(
  () => props.isSuspendSuccess,
  (val) => {
    if (val) {
      badgeCount.value += 1;
      emit('refreshCalculationBadgeCount', true);
    }
  },
);

defineExpose({ handlePickOrder });
</script>

<template>
  <div class="scan-search">
    <div class="center-item">
      <div class="Sh-search">
        <ElAutocomplete
          ref="autocompleteRef"
          v-model="searchValue"
          class="Sh-search-input"
          value-key="major_name"
          popper-class="Sh-search-popper"
          :readonly="readonly"
          :teleported="false"
          :trigger-on-focus="false"
          :fetch-suggestions="[]"
          :select-when-unmatched="false"
          :placeholder="$t('scan.barcode-product-code-product-name')"
          :maxlength="128"
          @blur="handleBlur"
          @focus="handleFocus"
          @select="handleSelect"
          @keyup.enter="handleEnterKeyDebounced"
        >
          <template #prefix>
            <img
              :src="codeIcon"
              :width="47"
              :height="80"
              style="height: 30px"
            />
          </template>
          <template #default="{ item }">
            <div
              v-if="item.isHeader"
              class="Sh-info"
              style="pointer-events: none; background-color: #eee"
            >
              <div class="Sh-info-code">
                {{ $t('common.product-code') }}
              </div>
              <div class="Sh-info-name">
                {{ $t('common.product-name') }}
              </div>
              <div class="Sh-info-type">
                {{ $t('common.product-unit-name') }}
              </div>
              <div class="Sh-info-price">{{ $t('common.cost_price') }}</div>
              <div class="Sh-info-quantity">{{ $t('common.stock') }}</div>
            </div>
            <div v-else class="Sh-info">
              <span class="Sh-info-code">{{ item.product_code || '-' }}</span>
              <span class="Sh-info-name">{{ item.major_name || '-'
                }}{{
                  item.product_spec_kvmessage
                    ? `-${item.product_spec_kvmessage}`
                    : ''
                }}</span>
              <span class="Sh-info-type">{{
                item.product_unit_name || '-'
              }}</span>
              <span class="Sh-info-price">{{
                thousandSeparator(item.selling_price) || '-'
              }}</span>
              <span
                class="Sh-info-quantity"
                :class="[
                  {
                    'show-red':
                      item.stock_total_quantity <= 0 && isLessZeroProhibited,
                  },
                ]"
              >
                {{
                  thousandSeparator(item.stock_total_quantity_message) || '-'
                }}
              </span>
            </div>
          </template>
        </ElAutocomplete>
      </div>
      <ElButton
        type="primary"
        class="mt-[5px] h-[50px] w-36"
        @click="handleEnterKeyDebounced()"
      >
        <div class="sale flex gap-2">
          <div class="sale-left">
            <i class="iconfont icon-sousuo"></i>
          </div>
          <div class="sale-right">
            <span>{{ t('common.search') }}</span>
          </div>
        </div>
      </ElButton>
    </div>
    <!-- 挂单列表 -->
    <takeDetail
      ref="takeDetailRef"
      :drawer-return-show="isShowDialog"
      :drawer-return-title="takeTitle"
      @close-tkr="handleClose"
      @handle-take-order-info="handleTakeOrder"
      @calculation-badge-count="handleCalculationBadgeCount"
    />
  </div>
</template>

<style lang="scss">
.el-badge {
  margin-right: 10px;

  .el-badge__content.el-badge__content--danger {
    top: 5px;
    right: 5px;
  }
}

.good-info-box {
  width: 100%;
  overflow: hidden;
  border: 1px solid #e1e5eb;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 10%);

  .good-info-header,
  .good-info-box-item {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid #e1e5eb;
  }

  .good-info-header {
    font-weight: 600;
    color: #333;
    background-color: #f4f7fc;
  }

  .good-info-box-item:hover {
    background-color: #edf5ff;
  }

  .el-select-dropdown__item {
    padding: 0;

    &:nth-child(even) {
      background-color: #fafbfd;
    }

    &.selected {
      font-weight: bold;
      color: #1890ff;
      background-color: rgb(24 144 255 / 10%);
    }
  }

  .good-info-cell {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #666;
    white-space: nowrap;

    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }

    &:first-child {
      font-weight: 500;
      color: #333;
    }
  }
}

.sale-select {
  .el-select__wrapper {
    min-height: 50px !important;
  }
}
</style>
<style lang="scss" scoped>
.Sh-search {
  flex: 1;

  :deep(.el-autocomplete) {
    height: 100%;

    .el-input {
      height: 100%;
    }

    .el-input__wrapper {
      border-radius: 0;
    }
  }

  :deep(.el-autocomplete__popper) {
    .el-autocomplete-suggestion {
      li {
        margin-bottom: 7px;

        &:nth-child(even) {
          .Sh-info {
            background-color: #f0f9ff;
          }
        }

        &:hover {
          background-color: transparent;
        }

        .Sh-info {
          position: relative;
          display: flex;
          align-items: center;
          padding: 4px 10px;
          color: #333;

          .off-sales {
            position: absolute;
            top: 4px;
            left: 97px;
            width: 35px;
            height: 35px;
          }

          span {
            box-sizing: border-box;
            padding: 0 10px;
            border-right: 1px solid #cfcfcf;

            &:last-child {
              border-right: 0;
            }
          }

          &:hover {
            color: #fff !important;
            background-color: #0d99ff !important;

            span {
              border-right-color: #fff !important;
            }
          }

          &-code {
            width: 140px;
          }

          &-name {
            flex: 1;
          }

          &-type {
            width: 160px;
            padding-left: 25px !important;
          }

          &-price {
            width: 150px;
          }

          &-quantity {
            width: 150px;
          }
        }

        .Sh-info-title {
          display: flex;
          align-items: center;
          padding: 4px 10px;
          color: #333;

          span {
            box-sizing: border-box;
            padding: 0 10px;
            border-right: 1px solid #cfcfcf;

            &:last-child {
              border-right: 0;
            }
          }

          &:hover {
            color: #fff;
            background-color: #0d99ff;

            span {
              border-right-color: #fff;
            }
          }

          &-code {
            width: 140px;
          }

          &-name {
            flex: 1;
          }

          &-type {
            width: 160px;
          }

          &-price {
            width: 150px;
          }

          &-quantity {
            width: 150px;
          }
        }
      }
    }
  }

  .show-red {
    color: red;
  }
}

.icon-peiqudan {
  color: #fff;
}

.scan-search {
  position: relative;

  .top-title {
    height: 34px;
    margin-left: 21px;
    font-size: 24px;
    font-weight: bold;
    color: #323232;

    .icon-bangzhu {
      color: #7d90b2;
    }
  }

  .top-search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-top: 8px;
    .left {
      margin-left: 14px;

      .role-btn {
        margin-left: 10px;
        color: #fff;
        background-color: #4a9ffc;
      }
    }

    .right {
      .role-add {
        margin-right: 10px;
        color: #fff;
        background-color: #005cff;
      }
    }
  }

  .center-item {
    display: flex;

    .sale-select {
      flex: 1;
      //   height: 30px;
    }

    :deep(.el-dropdown-link.el-tooltip__trigger.el-tooltip__trigger) {
      width: 100% !important;
    }

    :deep(.el-dropdown) {
      flex: 1;
    }

    :deep(.el-input) {
      width: 100% !important;
      height: 50px;
      margin-top: 5px;
    }

    .order-item {
      margin-left: 5px;
    }

    .pick-item {
      margin-top: 5px;

      // margin-left: 5px;
    }

    .custom-item {
      margin-left: 5px;
    }

    .good-info-box {
      display: flex;
      flex-direction: column;

      span {
        display: block;
        margin-left: 10px;
      }
    }
  }

  .icon-tiaoxingma {
    height: 20px;
    margin-bottom: 10px;
    font-size: 57px;
    color: #7d90b2;
  }

  .goods-dropdown {
    position: absolute;
    top: 100%;
    left: 355px;
    z-index: 1000;
    width: 67.5%;
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);

    .dropdown-header {
      display: flex;
      padding: 8px;
      font-weight: bold;
      background-color: #f6f8fc;
    }

    .header-cell {
      flex: 1;
      padding: 8px;
      color: #333;
      text-align: left;
    }

    .dropdown-item {
      display: flex;
      padding: 8px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      transition: background-color 0.3s;

      &:hover {
        background-color: #e6f7ff;
      }
    }

    .item-cell {
      flex: 1;
      padding: 8px;
      color: #666;
      text-align: left;
    }
  }
}

.custom-dropdown-menu {
  min-width: 100%;
  padding: 0;

  .dropdown-footer {
    padding: 10px;
    text-align: right;
  }

  :deep(.el-table__header) {
    width: 1000px !important;
  }
}
</style>
