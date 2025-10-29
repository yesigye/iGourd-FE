<script setup lang="ts">
import { ref } from 'vue';

import {
  ElButton,
  ElInput,
  ElPagination,
  ElTabPane,
  ElTabs,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { getBalanceDetailApi } from '@@/customer/apis';

interface BalanceChangeItem {
  id: number;
  customer_id: number;
  customer_name: string;
  creator_id: number;
  creator_name: string;
  create_time: string;
  balance_change_type: string;
  balance_change_amount: number;
}
const { t } = useI18n();
const useStore = useUserStore();
const { merchantInfo } = useStore;
const currencySymbol = merchantInfo?.currency_symbol || '';
const customerInfo = ref({});
const balanceChangeList = ref<BalanceChangeItem[]>([]);
const total = ref(0);
const currentPage = ref(1);
const activeTab = ref('RECHARGE');
const [Drawer, drawerApi] = useIgourdDrawer({
  onOpenChange(isOpen) {
    if (isOpen) {
      keyword.value = '';
      const data = drawerApi.getData();
      customerInfo.value = data?.data || {};
      getBalanceDetail();
    }
  },
});
const keyword = ref('');
// 获取变更list
const getBalanceDetail = async () => {
  const res = await getBalanceDetailApi({
    customer_id: customerInfo.value.id,
    change_type: activeTab.value,
    page_num: currentPage.value,
    page_size: 10,
  });
  if (res.code === 0) {
    balanceChangeList.value = res.data.list || [];
    total.value = res.data.total || 0;
  }
};
const handleTabChange = (val: string) => {
  activeTab.value = val;
  currentPage.value = 1;
  getBalanceDetail();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getBalanceDetail();
};
</script>
<template>
  <!-- 余额变更抽屉 -->
  <Drawer>
    <section class="flex h-full flex-col gap-5 px-5 py-2.5">
      <div class="flex shrink-0 items-center gap-2.5">
        <ElInput
          v-model="keyword"
          placeholder="Enter(order no./vendor name/.."
        />
        <ElButton type="primary">{{ t('common.search') }}</ElButton>
      </div>
      <div class="flex-1 overflow-hidden">
        <ElTabs
          v-model="activeTab"
          class="h-full"
          @tab-change="handleTabChange"
        >
          <ElTabPane :label="t('list.recharge')" name="RECHARGE" class="h-full">
            <div class="flex h-full flex-col gap-2.5">
              <div class="flex-1 overflow-auto">
                <div
                  class="rounded-md border border-solid border-[#E9E9EB] p-4"
                  v-for="(item, index) in balanceChangeList"
                  :key="item.id"
                >
                  <p>{{ t('list.customer') }}:{{ item.customer_name }}</p>
                  <p class="mt-1">
                    {{ t('list.creator') }}:{{ item.creator_name }}
                  </p>
                  <p class="mt-1">
                    {{ t('list.creation-time') }}:{{ item.create_time }}
                  </p>
                  <div class="flex w-full items-end justify-between">
                    <span class="text-success">{{
                      t(`enmu.balance-change-types${item.status}`)
                    }}</span>
                    <p class="text-[24px]">
                      <span class="text-[#FC5C65]">{{ item.remark }} </span>
                      <span class="text-2xl">{{ currencySymbol }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="shrink-0">
                <ElPagination
                  :total="total"
                  :page-size="10"
                  v-model:current-page="currentPage"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </ElTabPane>
          <ElTabPane
            :label="t('list.consume')"
            name="CONSUMPTION"
            class="h-full"
          >
            <div class="flex h-full flex-col gap-2.5">
              <div class="flex-1 overflow-auto">
                <div
                  class="rounded-md border border-solid border-[#E9E9EB] p-4"
                  v-for="(item, index) in balanceChangeList"
                  :key="item.id"
                >
                  <p>{{ t('list.customer') }}:{{ item.customer_name }}</p>
                  <p class="mt-1">
                    {{ t('list.creator') }}:{{ item.creator_name }}
                  </p>
                  <p class="mt-1">
                    {{ t('list.creation-time') }}:{{ item.create_time }}
                  </p>
                  <div class="flex w-full items-end justify-between">
                    <span class="text-success">{{
                      t(`enmu.balance-change-types${item.status}`)
                    }}</span>
                    <p class="text-[24px]">
                      <span class="text-[#FC5C65]">{{ item.remark }} </span>
                      <span class="text-2xl">{{ currencySymbol }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="shrink-0">
                <ElPagination
                  :total="total"
                  :page-size="10"
                  v-model:current-page="currentPage"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </ElTabPane>
        </ElTabs>
      </div>
    </section>
  </Drawer>
</template>
