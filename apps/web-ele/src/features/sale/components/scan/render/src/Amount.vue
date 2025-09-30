<script lang="ts" setup>
import { computed } from 'vue';

import { thousandSeparator } from '#/utils/sale';

type PropsType = { detailInfo: AnyObject };

const props = withDefaults(defineProps<PropsType>(), {
  detailInfo: () => ({
    calcInfo: {} as AnyObject,
  }),
});

const calcInfo: AnyObject = computed(() => {
  return props.detailInfo?.calcInfo || {};
});
</script>

<template>
  <div class="amount">
    <div class="amount-value">
      <span>{{ thousandSeparator(calcInfo.total_amount) }}</span>
    </div>
    <div class="amount-sub" v-if="calcInfo.promotion_discount_amount">
      <span class="amount-sub-text">{{
        thousandSeparator(calcInfo.promotion_discount_amount)
      }}</span>
      <span
        class="amount-sub-rate"
        v-if="
          calcInfo.promotion_id &&
          calcInfo.promotion_info?.discount_percentage !== undefined
        "
      >
        -{{ calcInfo.promotion_info.discount_percentage }}%
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.amount {
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

    .icon-icon_Membership_amount {
      color: #ffc700;
    }
  }

  &-sub {
    padding-top: 3px;
    font-size: 12px;
    color: #999;

    span {
      display: inline-block;
      line-height: 1;
    }

    &-rate {
      box-sizing: border-box;
      padding: 2px 6px;
      margin-left: 10px;
      color: #fff;
      background-color: #ff8151;
      border-radius: 2px;
    }
  }
}
</style>
