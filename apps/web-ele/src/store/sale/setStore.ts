import { useStorage } from '@vueuse/core';
// 设置
import { defineStore } from 'pinia';

export const useSetStore = defineStore('set', () => {
  const initState = {
    // 是否允许负库存
    isLessZeroProhibited: false,
    // 挂单有效时间
    holdOrderTtlMins: 10,
    // 每日结算时间
    dailySettlementTime: 10,
  };
  const setInfo = useStorage<any>('setInfo', { ...initState });

  const $reset = () => {
    Object.assign(setInfo, initState);
  };
  return { setInfo, $reset };
});
