import { orderListApi } from '@@/sale/apis/scan';
/**
 * 订单store
 */
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => {
    return {
      // 订单列表
      orderListData: [],
      // 订单列表总条数
      orderListTotal: 0,
      calculateOrderList: [],
      mergeGoodsList: [],
    };
  },
  getters: {},
  actions: {
    /**
     * 获取订单列表
     */
    async getOrderList(params: any) {
      try {
        const res = await orderListApi(params);
        this.orderListData = res?.data?.list || [];
        this.orderListTotal = res?.data.total || 0;
      } catch (error: any) {
        console.error('Get Order list:', error);
      }
    },
    setCalculateOrderList(list) {
      this.calculateOrderList = list;
    },
    setMergeGoodsList(list) {
      this.mergeGoodsList = list;
    },
  },
});
