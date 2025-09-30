<template>
  <div class="payarea">
    <div class="scan-settle-content">
      <div class="scan-settle-content-item">
        <p class="scan-settle-content-item-title">
          {{ t('sales.totalAmount') + ':' }}
        </p>
        <p class="scan-settle-content-item-value">
          {{ calculateOrderList.subtotal_amount >= 0 ? thousandSeparator(calculateOrderList.subtotal_amount) : '--'
          }}{{ currentSymbol }}
        </p>
      </div>
      <div class="scan-settle-content-item">
        <p class="scan-settle-content-item-title">{{ t('sales.tax') + ':' }}</p>
        <p class="scan-settle-content-item-value">
          {{ calculateOrderList.vat_amount >= 0 ? thousandSeparator(calculateOrderList.vat_amount) : '--'
          }}{{ currentSymbol }}
        </p>
      </div>
      <div class="scan-settle-content-item">
        <p class="scan-settle-content-item-title">
          {{ t('sales.discount') + ':' }}
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
        {{ t('sales.actualAmount') + ':' }}
      </p>
      <p class="scan-settle-content-item-value-actual amountAll">
        {{ calculateOrderList.total_amount >= 0 ? thousandSeparator(calculateOrderList.total_amount) : '--'
        }}{{ currentSymbol }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// import
import { useI18n } from 'vue-i18n';
import { computed, inject, ref, onMounted } from 'vue';
import { initializeCurrencySymbol } from '@/utils/helpers/global';
import { thousandSeparator } from '@/service/sale.service';

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
  calculateOrderList
});
// watch

// events
</script>

<style scoped lang="scss">
.payarea {
  display: flex;
  align-items: center;
}
.payingRight {
  margin-left: 35px;
}
.amountAll {
  color: #ff9e0d;
  font-size: 22px;
}
.scan-settle-content {
  padding: 2px 10px;
  background-color: #fff;
  min-width: 70%;
  .scan-settle-content-item {
    font-size: 16px;
    display: flex;
    height: 30px;
    width: 100%;
    line-height: 30px;
    justify-content: space-between;
    border-bottom: 1px solid #e6e6e6;
  }
  .scan-settle-content-item-title {
    color: #606266;
    font-size: 16px;
    white-space: nowrap;
  }
  .scan-settle-content-item-title-actual {
    color: #606266;
    font-size: 17px;
    font-weight: 700;
    white-space: nowrap;
  }
  .scan-settle-content-item-value-actual {
    color: #ff9e0d;
    font-size: 17px;
    font-weight: 700;
    white-space: nowrap;
  }
}
</style>
