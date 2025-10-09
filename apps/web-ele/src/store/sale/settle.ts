import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

import { incrementAndPad, parseTime } from '#/utils/sale';

export const useSaleSettleStore = defineStore('saleSettle', () => {
  // TODO 对应应该使用 Reactive，不应当使用 ref
  const orderInfo = ref<{ serialNo: number }>({
    serialNo: 1,
  });

  // 订单流水号
  const serialNo = computed(() => incrementAndPad(orderInfo.value.serialNo, 3));
  // 订单流水号生成规则：日期(241025)+自增序列号(以天为单位，从001开始自增)
  const orderSerialNo = computed(() => {
    const year = parseTime(Date.now(), '{y}{m}{d}').slice(2);
    return `${year}${serialNo.value}`;
  });
  const $reset = () => {
    orderInfo.value = { serialNo: 1 };
  };
  return {
    orderInfo,
    orderSerialNo,
    serialNo,
    $reset,
  };
});
