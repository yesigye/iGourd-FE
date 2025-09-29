<script lang="ts" setup>
import { computed } from 'vue';

import { divideDecimal } from '#/utils/decimal.serice';
import { thousandSeparator } from '#/utils/sale';

type PropsType = { detailInfo: AnyObject };
const props = withDefaults(defineProps<PropsType>(), {
  detailInfo: () => ({
    calcInfo: {},
  }),
});

const calcInfo: AnyObject = computed(() => {
  return props.detailInfo?.calcInfo || {};
});

const price = computed(() => {
  return (
    divideDecimal(
      calcInfo.value?.total_amount || 0,
      calcInfo.value?.stock_total_quantity || 0,
    ) || 0
  );
});

const originPrice = computed(() => {
  return props.detailInfo?.selling_price || 0;
});

const icons = computed(() => {
  if (calcInfo.value?.vip_discount_amount) {
    return 'icon-icon_Membership_price';
  }
  if (calcInfo.value?.promotion_discount_amount) {
    return 'icon-icon_Exchange';
  }
  return '';
});
</script>

<template>
  <div class="price">
    <div class="price-value">
      <i v-if="icons" class="iconfont" :class="[icons]"></i>
      <span>{{
        icons ? thousandSeparator(price) : thousandSeparator(originPrice)
      }}</span>
    </div>
    <div class="price-line" v-if="icons">
      {{ thousandSeparator(originPrice) }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.price {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  // align-items: center;
  &-value {
    display: flex;
    align-items: center;
    color: #333;

    .iconfont {
      margin-right: 2px;
    }

    .icon-icon_Exchange {
      color: #fc5c65;
    }

    .icon-icon_Membership_price {
      color: #ffc700;
    }
  }

  &-line {
    font-size: 12px;
    color: #999;
    text-decoration: line-through;
  }
}
</style>
