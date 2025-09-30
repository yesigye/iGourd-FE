import { getCustomerPageListApi } from '@@/customer/apis';
/**
 * 客户store
 */
import { defineStore } from 'pinia';

export const useCustomerStore = defineStore('customer', {
  state: () => {
    return {
      // 客户列表
      customerList: [],
    };
  },
  getters: {},
  actions: {
    /**
     * 获取客户列表
     */
    async getCustomerList(params: any) {
      try {
        const { data } = await getCustomerPageListApi(params);
        this.customerList = data?.list || [];
      } catch (error) {
        console.error(error);
      }
    },
  },
});
