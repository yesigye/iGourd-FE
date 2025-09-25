<script setup lang="ts">
import { Page, ElButton } from '@igourd/common-ui';
import { SettingItem } from '@@/setting/components/common';
import { getSettingStoresetDetailApi, updateSettingStoresetApi } from '@@/setting/apis';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@igourd/stores';

const { currentLoginUserApp } = useUserStore();
const storeInfo = ref({});

const basicInforMation = ref([
  {
    title: 'Version',
    data: storeInfo.value,
    isText: true,
    key: ['version'],
  },
  {
    title: 'Cash Register Receipt',
    key: ['business_type'],
    isText: true,
  },
  {
    title: 'validity',
    key: ['validity'],
    isText: true,
  },
  {
    title: 'registration time',
    key: ['create_time'],
    isText: true,
  },
  {
    title: 'Client sideos',
    value: '财务门店',
    isText: true,
  },
]);
const storeSetting = ref([
  {
    title: 'Store Name',
    label: '(Show store name)',
    isEdit: true,
    isText: true,
    type: ['ElInput'],
    key: ['full_name'],
  },
  {
    title: 'store short name',
    key: ["short_name"],
    label: ' (You can use the abbreviation instead of the store name)',
    isEdit: true,
    isText: true,
    type: ['ElInput'],
  },
  {
    title: 'store logo',
    label: '(Show store name)',
    isEdit: true,
    isText: true,
    type: ['ElUpload'],
    key: ['profile_photo'],
  },
  {
    title: 'store no.',
    label: '(Show store name)',
    isEdit: true,
    isText: true,
    options: [[
      {
        label: 'Country Code',
        value: 'contact_country_area_code',
      },
      {
        label: 'Phone Number',
        value: 'contact_telephone',
      },
    ]],
    type: ['ElSelect', 'ElInput'],
    key: ['contact_country_area_code', 'contact_telephone'],
  },
  {
    title: 'Country',
    label: '(Show store name)',
    isEdit: true,
    isText: true,
    type: ['ElSelect'],
    key: ['cost_currency_code'],
  },
  {
    title: 'time zone',
    value: '财务门店',
    label: '(Show store name)',
    isEdit: true,
    isText: true,
    type: ['ElSelect'],
    key: ['country_time_zone_id'],
  },
]);
// 获取门店设置
const getStoreSetting = async () => {
  const result = await getSettingStoresetDetailApi({
    id: currentLoginUserApp.owner_id,
  });
  storeInfo.value = result;
};
onMounted(() => {
  getStoreSetting();
});
</script>
<template>
  <Page auto-content-height>
    <section class=" h-full">
      <p class="mb-4 ">Basic Information</p>
      <!-- 设置项 -->
      <section class="pb-4 pl-5 pr-5 pt-4 bg-card">
        <SettingItem
          v-for="item in basicInforMation"
          :key="item.title"
          :info="item"
          :api="updateSettingStoresetApi"
          :settingInfo="storeInfo"
        ></SettingItem>
      </section>
      <p class="mb-4 mt-4">store settings</p>
      <!-- 设置项 -->
      <section class="pb-4 pl-5 pr-5 pt-4 bg-card ">
        <SettingItem
          v-for="item in storeSetting"
          :key="item.title"
          :info="item"
          :api="updateSettingStoresetApi"
          :settingInfo="storeInfo"
        ></SettingItem>
      </section>
    </section>
  </Page>
</template>
