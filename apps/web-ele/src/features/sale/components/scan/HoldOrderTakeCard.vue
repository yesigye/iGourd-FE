<script lang="ts" setup>
import { useUserStore } from '@igourd/stores';

const props = withDefaults(defineProps<PropsType>(), {
  active: false,
  itemInfo: () => ({
    id: '',
    remarks: '',
  }),
});
const emits = defineEmits<{
  (e: 'select-item', info: any): void; // 增加商品到列表
}>();
const useStore = useUserStore();
const { currencySymbol, merchantInfo, merchantId } = useStore;
type PropsType = { active?: boolean; itemInfo: any };

function handleClick() {
  emits('select-item', props.itemInfo);
}
</script>

<template>
  <div class="Ti" :class="[{ active }]" @click.stop="handleClick">
    <div class="Ti-li text-dark-gray">
      <!-- 订单备注移到订单详情页面 -->
      <div class="Ti-li-nav Ti-li-nav__remarks">
        <div class="Ti-li-value">{{ itemInfo.remark }}</div>
      </div>
    </div>
    <div class="Ti-li Ti-li__time">
      <div class="Ti-li-section">
        <div class="Ti-li-time text-12">{{ itemInfo.customer_name }}</div>
        <div class="Ti-li-time text-12">{{ itemInfo.create_time }}</div>
      </div>

      <div class="Ti-li-section">
        <div class="Ti-li-section text-right">
          <span class="Ti-li-price text-watermelon">{{
            itemInfo.total_amount
          }}</span>
          <span class="Ti-li-unit">{{ currencySymbol }}</span>
        </div>
        <div class="Ti-li-qty text-light-gray text-14 text-right">
          Qty-{{ itemInfo.quantity }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Ti {
  &-li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &-nav__remarks {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-label {
      font-weight: 500;
    }

    &-value {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      font-size: 12px;
      white-space: break-spaces;
      -webkit-box-orient: vertical;
    }

    &-price {
      margin-right: 5px;
      font-size: 24px;
      font-weight: 500;
      line-height: 1;
    }

    &__time {
      padding-top: 20px;
    }
  }
}
</style>
