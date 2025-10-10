<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { useI18n } from '@igourd/locales';

import { initializeCurrencySymbol } from '#/utils/sale';

// props
const props = defineProps({
  compuredReturnedinfo: {
    type: Object,
    default: () => ({}),
  },
});
// const refunedNum = computed(() => {
//   let num = 0
//   if (props.compuredReturnedinfo.order_calc_product_model_list > 0) {
//     props.compuredReturnedinfo.order_calc_product_model_list.forEach(item => {
//       console.log(item, 'ssssssssssssss')
//       num += item.quantity
//     })
//   }

//   return num
// })
const refunedNum = ref(0);
watch(
  () => props.compuredReturnedinfo,
  () => {
    let num = 0;
    if (
      Object.keys(props.compuredReturnedinfo).length > 0 &&
      props.compuredReturnedinfo.order_calc_product_model_list.length > 0
    ) {
      props.compuredReturnedinfo.order_calc_product_model_list.forEach(
        (item) => {
          num += item.quantity;
        },
      );
    }
    refunedNum.value = num;
  },
);
/**
 * 优惠金额
 * @description 优惠金额 = promotion_discount_amount +  round_down_amount +  debt_deduction_amount

 */
const discountAmount = computed(() => {
  let discount = 0;

  discount =
    props.compuredReturnedinfo.promotion_discount_amount +
    props.compuredReturnedinfo.round_down_amount +
    props.compuredReturnedinfo.vip_discount_amount;
  return discount ? discount.toFixed(2) : 0;
});

const { t } = useI18n();
const currentSymbol = ref('');
onMounted(async () => {
  currentSymbol.value = await initializeCurrencySymbol();
});
</script>

<template>
  <div class="flex justify-end bg-white text-xs">
    <div class="">
      <div class="text-base font-bold">
        <span class="text-warning">{{ t('returned.refund') }}: </span>
        <span class="text-error">
          - {{ currentSymbol
          }}{{ props.compuredReturnedinfo.total_paid_amount || 0 }}
        </span>
      </div>
      <div class="mt-2">
        <span>{{ t('returned.refund-qty') }} : {{ refunedNum || 0 }}</span>
        <span class="ml-2.5"
          >{{ t('returned.total') }} : -{{ currentSymbol
          }}{{ props.compuredReturnedinfo.subtotal_amount || 0 }}</span
        >

        <!-- <span class="ml-2.5"
          >{{ t('sales.balance_debt') }} : -{{ currentSymbol
          }}{{ props.compuredReturnedinfo.debt_deduction_amount || 0 }}</span
        > -->
      </div>
      <div class="mt-2">
        <span> {{ t('returned.applied-discounts-and-promotions') }}: </span>

        {{ currentSymbol }}{{ discountAmount || 0 }}
      </div>
    </div>
  </div>
</template>
