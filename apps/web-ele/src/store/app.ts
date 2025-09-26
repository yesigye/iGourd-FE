/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useUserStore } from '@igourd/stores';

import { acceptHMRUpdate, defineStore } from 'pinia';

import { basicsMerchantList } from '#/api';

function customizerMerchantList(dataList: any, user_apps: any) {
  if (dataList?.length && user_apps?.length) {
    // @ts-ignore
    return dataList.reduce((acc, cur) => {
      // @ts-ignore
      user_apps.forEach((item) => {
        if (item.owner_id === cur.merchant_id) {
          acc.push({ ...cur, ...item });
        }
      });
      return acc;
    }, []);
  }
  return [];
}

export const useAppStore = defineStore('store', {
  state: () => ({
    apps: [],
  }),
  persist: {
    serializer: {
      serialize: (state: any) => JSON.stringify(state),
      deserialize: (str: string) => ({ ...JSON.parse(str) }),
    },
  },
  actions: {
    setApps(apps: any) {
      this.apps = apps;
    },
    async fetchApps() {
      const userStore = useUserStore();
      const userApps = userStore.user_apps || [];
      // @ts-ignore
      const merchant_ids = userApps.map((item) => item.owner_id);
      const res = await basicsMerchantList({ merchant_ids });
      this.setApps(res);
      const merchantInfo = res.find(
        // @ts-ignore
        (item) => item.merchant_id === userStore.owner_id,
      );
      userStore.setMerchantInfo(merchantInfo);
    },
  },
});
// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useAppStore, hot));
}
