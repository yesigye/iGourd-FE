<template>
  <div class="stock">
    <div class="stock-left">
      <div class="stock-left-title">
        {{ warehouseName }}
      </div>
      <div class="stock-left-code">{{ detailInfo.sale_warehouse_product_stock_quantity_message }} </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

type PropsType = {
  detailInfo: {
    sale_warehouse_name: string;
    currentStock: number;
    warehouse_name?: string;
    sale_warehouse_product_stock_quantity: number;
    stock_total_quantity: number;
  };
};

const props = withDefaults(defineProps<PropsType>(), {
  detailInfo: () => ({})
});

// Add warehouse name computed property
const warehouseName = computed(() => {
  return props.detailInfo?.sale_warehouse_name || props.detailInfo?.warehouse_name || '';
});

// 处理为null
const stockQuantity = computed(() => {
  return props.detailInfo?.sale_warehouse_product_stock_quantity ?? 0;
});

const totalStockQuantity = computed(() => {
  return props.detailInfo?.stock_total_quantity ?? 0;
});
</script>

<style lang="scss" scoped>
.stock {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // text-align: center;
  &-left {
    flex: 1;
    // padding-right: 10px;
    box-sizing: border-box;
    overflow: hidden;
    &-title {
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .iconfont {
        color: #fc5c65;
      }
    }
    &-code {
      max-width: 120px;
      font-size: 12px;
      color: #999999;
    }
  }

  &-stock {
    color: #0d99ff;
    font-size: 10px;
    // width: 54px;
    height: 36px;
    padding: 4px;
    text-align: center;
    box-sizing: border-box;
    background-color: #e3f4ff;
    border-radius: 4px;
    line-height: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &-code,
    &-count {
      padding: 2px 0;
    }
  }
}
</style>
