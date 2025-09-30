<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';

// import
import { useI18n } from '@igourd/locales';

import { initializeCurrencySymbol, thousandSeparator } from '#/utils/sale';

// props
interface Props {
  goodsList: any[];
}
const props = defineProps<Props>();

// data
const { t } = useI18n();
const totalPrice = inject('totalPrice');
const calculateOrderList = inject<any>('calculateOrderList');

// 总金额
const totalAmount = computed(() => {
  // let total = 0;
  // props.goodsList.forEach(item => {
  //   total += item.total_amount;
  // });
  // return total;
  if (!calculateOrderList) {
    return '--';
  }
  return calculateOrderList.total_amount + currentSymbol.value;
});

// 生命周期
const currentSymbol = ref('');
onMounted(async () => {
  currentSymbol.value = await initializeCurrencySymbol();
});
// emits

// computed
// methods
defineExpose({
  calculateOrderList,
});
// watch

// events
</script>

<template>
  <div class="payarea">
    <div class="scan-settle-content">
      <div class="scan-settle-content-item">
        <p class="scan-settle-content-item-title">
          {{ `${t('scan.totalAmount')}:` }}
        </p>
        <p class="scan-settle-content-item-value">
          {{
            calculateOrderList.subtotal_amount >= 0
              ? thousandSeparator(calculateOrderList.subtotal_amount)
              : '--'
          }}{{ currentSymbol }}
        </p>
      </div>
      <div class="scan-settle-content-item">
        <p class="scan-settle-content-item-title">{{ `${t('scan.tax')}:` }}</p>
        <p class="scan-settle-content-item-value">
          {{
            calculateOrderList.vat_amount >= 0
              ? thousandSeparator(calculateOrderList.vat_amount)
              : '--'
          }}{{ currentSymbol }}
        </p>
      </div>
      <div class="scan-settle-content-item">
        <p class="scan-settle-content-item-title">
          {{ `${t('scan.discount')}:` }}
        </p>
        <p class="scan-settle-content-item-value">
          {{
            calculateOrderList.promotion_discount_amount >= 0
              ? thousandSeparator(calculateOrderList.promotion_discount_amount)
              : '--'
          }}{{ currentSymbol }}
        </p>
      </div>
    </div>
    <div class="scan-settle-content-item payingRight">
      <p class="scan-settle-content-item-title-actual">
        {{ `${t('scan.actualAmount')}:` }}
      </p>
      <p class="scan-settle-content-item-value-actual amountAll">
        {{
          calculateOrderList.total_amount >= 0
            ? thousandSeparator(calculateOrderList.total_amount)
            : '--'
        }}{{ currentSymbol }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.payarea {
  display: flex;
  align-items: center;
}

.payingRight {
  margin-left: 35px;
}

.amountAll {
  font-size: 22px;
  color: #ff9e0d;
}

.scan-settle-content {
  min-width: 70%;
  padding: 2px 10px;
  background-color: #fff;

  .scan-settle-content-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    border-bottom: 1px solid #e6e6e6;
  }

  .scan-settle-content-item-title {
    font-size: 16px;
    color: #606266;
    white-space: nowrap;
  }

  .scan-settle-content-item-title-actual {
    font-size: 17px;
    font-weight: 700;
    color: #606266;
    white-space: nowrap;
  }

  .scan-settle-content-item-value-actual {
    font-size: 17px;
    font-weight: 700;
    color: #ff9e0d;
    white-space: nowrap;
  }
}
</style>
