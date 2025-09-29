<template>
  <div class="product">
    <div class="product-left">
      <div class="product-left-title">
        {{ detailInfo.major_name
        }}{{ detailInfo.product_spec_kvmessage ? '-' + detailInfo.product_spec_kvmessage : '' }}
      </div>
      <div class="product-left-code">
        <template v-if="detailInfo.product_unit_name">
          [{{ detailInfo.product_code }}]{{ detailInfo.product_spec_kvmessage }}
        </template>
      </div>
    </div>
    <!-- <div class="product-stock" v-if="detailInfo.initial_stock_warehouse_name">
      <div class="product-stock-code">
        {{ detailInfo.initial_stock_warehouse_name || '' }}
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
type PropsType = { detailInfo: AnyObject };
withDefaults(defineProps<PropsType>(), {
  detailInfo: () => ({})
});
</script>

<style lang="scss" scoped>
.product {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    flex: 1;
    padding-right: 10px;
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
