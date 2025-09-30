import {
  addCustomerLabelApi,
  customerLabelPageListApi,
  deleteCustomerLabelApi,
} from '@@/sale/apis';
import { defineStore } from 'pinia';

export const useCustomerLableStore = defineStore('customerLableStore', {
  state: () => {
    return {
      customerLableData: [],
    };
  },
  getters: {},
  actions: {
    /**
     * 获取标签
     * @param data
     */
    async getCustomerLableList(data) {
      const result = await customerLabelPageListApi(data);
      this.customerLableData = result;
    },
    /**
     * 删除标签
     * @param data
     */
    async deleteCustomerLabel(data) {
      await deleteCustomerLabelApi(data);
    },
    /**
     * 新增标签
     * @param data
     */
    async addCustomerLabel(data) {
      await addCustomerLabelApi(data);
    },
  },
});
