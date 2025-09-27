<script setup lang="ts">
import {
  Page, ElButton, ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElDatePicker,
  ElTimePicker,
  useIgourdModal
} from '@igourd/common-ui';
import {ExtraModal} from '@@/setting/components/saleset';

import { getSettingSalesetDetailApi,modifySettingSalesetApi } from '@@/setting/apis';
import { onMounted, ref, watch } from 'vue';
import { useUserStore } from '@igourd/stores';
import { useI18n } from '@igourd/locales';

const { t } = useI18n();
const { currentLoginUserApp } = useUserStore();
const storeInfo = ref({});
// 是否为首次加载
const isFirstLoad = ref(true);
// 获取门店设置
const getStoreSetting = async () => {
  const result = await getSettingSalesetDetailApi({
    port_type_enum: 'WEB',
  });
  storeInfo.value = result;
  if(result.revenue_auto_approve_amount_limit){
    isAutomaticReview.value = true;
  }
  isFirstLoad.value = false;
};
const isAutomaticReview = ref(true);
const option = ref([
  { value: 0, label: t('saleset.unlimited') },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 40, label: '40' },
  { value: 50, label: '50' },
  { value: 60, label: '60' },
])
watch(() => storeInfo.value, async (newVal) => {
  if (newVal) {
    // 首次加载不执行修改操作
    if (isFirstLoad.value) {
      return;
    }
    await modifySettingSalesetApi({
      ...newVal,
    });
  }
}, {deep:true});
const handleAutomaticReviewChange = (val) => {
  if(!val){
    storeInfo.value.revenue_auto_approve_amount_limit = 0;
  }else{
    storeInfo.value.revenue_auto_approve_amount_limit = 1000;
  }
}
const [Modal, modalApi] = useIgourdModal({
  // 连接抽离的组件
  connectedComponent: ExtraModal,
  class: 'w-[70%]',
  footer:false
});
function openModal() {
  modalApi.open();
}
//
onMounted(() => {
  getStoreSetting();
});
</script>
<template>
  <Page auto-content-height>
    <section class=" h-full text-xs">
      <p class="mb-4 flex items-center gap-2">
      <div class="w-1 h-2.5 rounded-md bg-primary"></div> {{ t('saleset.products-settings') }}</p>
      <!-- 设置项 -->
      <section class="pb-4 pl-5 pr-5 pt-4 bg-card">
        <!-- ----------设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.use-product-specifications-settings') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="w-[673px] text-[#999999]">
              {{ t('saleset.use-product-specifications-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end">
            <ElSwitch v-model="storeInfo.is_product_spec_settings"   />
          </div>
        </div>

        <!-- ----------设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.use-stock-warning-settings') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="w-[673px] text-[#999999]">
              {{ t('saleset.use-stock-warning-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end">
            <ElSwitch v-model="storeInfo.is_stock_warning_settings"   />
          </div>
        </div>
      </section>
      <p class="mb-4 mt-4  flex items-center gap-2">
      <div class="w-1 h-2.5 rounded-md bg-primary"></div> {{ t('saleset.store-settings') }}</p>

      <!-- 设置项 -->
      <section class="pb-4 pl-5 pr-5 pt-4 bg-card ">
        <!-- ----------门店全称设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.commodity-stock-less-than-zero-prohibited') }}</div>
          <div class="flex gap-10 items-center">
            <!-- 插槽label -->

            <div class="w-[673px] text-[#999999]">
             {{ t('saleset.commodity-stock-less-than-zero-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end">
             <ElSwitch v-model="storeInfo.is_less_zero_prohibited"   />
          </div>
        </div>
        <!-- ----------门店简称设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.temporary-repricing-of-sales') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="w-[673px] text-[#999999]">
              {{ t('saleset.temporary-repricing-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end">
            <ElSwitch v-model="storeInfo.is_price_modify_support" />
          </div>
        </div>
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.delete-the-cancel-order') }}</div>
          <div class="flex gap-10">

            <div class="w-[673px] text-[#999999]">
              {{ t('saleset.delete-cancel-order-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end">
            <ElSwitch v-model="storeInfo.is_auto_remove_invalid_orders"   />

          </div>
        </div>
        <!-- ----------门店联系方式设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.quick-tags-for-holding-orders') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->

            <div class="w-[673px] text-[#999999]">
              {{ t('saleset.store-no-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end">
            <ElButton type="primary"
              @click="openModal()">
              {{ t('saleset.edit') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店国家设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.validity-time-of-pending-order') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->

            <div class="w-[673px] text-[#999999]">
              {{ t('saleset.validity-time-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end">
           <ElSelect v-model="storeInfo.hold_order_ttl_mins" type="number" value-format="number">
             <ElOption v-for="item in option" :key="item.value" :label="item.value!=0 ? item.value + t('saleset.minutes') : t('saleset.unlimited')" :value="item.value">
             </ElOption>
           </ElSelect>
          </div>
        </div>
        <!-- ----------每日结算时间------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.daily-settlement-time') }}</div>
          <div class="flex gap-10 items-center">
            <!-- 插槽label -->

            <div class="w-[673px] text-[#999999]">
              {{ t('saleset.daily-settlement-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end">
            <ElTimePicker format="HH:mm:ss" value-format="HH:mm:ss" v-model="storeInfo.daily_settlement_time"></ElTimePicker>
          </div>
        </div>
        <!-- ----------财会凭证自动审核------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[290px] font-bold">{{ t('saleset.automatic-review-of-accounting-notes') }}</div>
          <div class="flex gap-10 items-center">

            <div class="w-[673px] text-[#999999]">
              {{ t('saleset.automatic-review-tip') }}
            </div>
          </div>

          <div class="flex min-w-[250px] justify-end gap-2">
                <ElSwitch v-model="isAutomaticReview" @change="handleAutomaticReviewChange"   />
                <ElInput v-model="storeInfo.revenue_auto_approve_amount_limit" :disabled="!isAutomaticReview" type="number"></ElInput>
          </div>
        </div>

      </section>
    </section>
    <Modal></Modal>
  </Page>
</template>
