import { useStorage } from '@vueuse/core';
// 设置
import { defineStore } from 'pinia';

export const useSetStore = defineStore('set', () => {
  const setInfo = useStorage<any>('setInfo', {
    // 是否允许负库存
    isLessZeroProhibited: false,
    // 挂单有效时间
    holdOrderTtlMins: 10,
    // 每日结算时间
    dailySettlementTime: 10,
  });
  return { setInfo };
});
