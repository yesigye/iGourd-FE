<script setup lang="ts">
import {
  Page, ElButton, ElInput,
  ElSelect,
  ElOption,
} from '@igourd/common-ui';

import { getSettingStoresetDetailApi, getTimezoneListApi } from '@@/setting/apis';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@igourd/stores';
import { useI18n } from '@igourd/locales';
const { t } = useI18n();
const { currentLoginUserApp } = useUserStore();
const storeInfo = ref({});

const timezoneList = ref([]);
/**
 * 时区列表
*/
const getTimezoneList = async () => {
  const result = await getTimezoneListApi({});
  timezoneList.value = result.map((item) => ({
    label: item.zone_id_name_local + '/' + item.zone_id_name_cn,
    value: item.zone_id,
  }));
}

// 获取门店设置
const getStoreSetting = async () => {
  const result = await getSettingStoresetDetailApi({
    id: currentLoginUserApp.owner_id,
  });
  storeInfo.value = result;
};
/**正在编辑的行*/
const editKeyList = ref([]);
/**判断当前行是否处于编辑状态*/
const isEdit = (key: string) => editKeyList.value.includes(key);
const handleEditClick = (key: string) => {
  if (editKeyList.value.includes(key)) {
    editKeyList.value = editKeyList.value.filter((item) => item !== key);
  } else {
    editKeyList.value.push(key);
  }
}
//
onMounted(() => {
  getStoreSetting();
  getTimezoneList();
});
</script>
<template>
  <Page auto-content-height>
    <section class=" h-full text-xs">
      <p class="mb-4 flex items-center gap-2">
      <div class="w-1 h-2.5 rounded-md bg-primary"></div> Basic Information</p>
      <!-- 设置项 -->
      <section class="pb-4 pl-5 pr-5 pt-4 bg-card">
        <!-- ----------设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">version</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              {{ storeInfo.version }}
            </div>
            <div class="w-[500px] text-[#999999]">
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
          </div>
        </div>

        <!-- ----------设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Cash Register Receipt</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              {{ storeInfo.business_type }}
            </div>
            <div class="w-[500px] text-[#999999]">
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
          </div>
        </div>
        <!-- ----------设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Validity</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              {{ storeInfo.validity }}
            </div>
            <div class="w-[500px] text-[#999999]">
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
          </div>
        </div>
        <!-- ----------设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Registration Time</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              {{ storeInfo.create_time }}
            </div>
            <div class="w-[500px] text-[#999999]">
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
          </div>
        </div>
        <!-- ----------设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Client Sideos</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
            </div>
            <div class="w-[500px] text-[#999999]">
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
          </div>
        </div>
      </section>
      <p class="mb-4 mt-4  flex items-center gap-2">
      <div class="w-1 h-2.5 rounded-md bg-primary"></div> Store Settings</p>

      <!-- 设置项 -->
      <section class="pb-4 pl-5 pr-5 pt-4 bg-card ">
        <!-- ----------门店全称设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Store Name</div>
          <div class="flex gap-10 items-center">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              <p v-if="!isEdit('full_name')">{{ storeInfo.full_name }}</p>
              <ElInput v-model="storeInfo.full_name" v-else></ElInput>
            </div>
            <div class="w-[500px] text-[#999999]">
              (Show store name)
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton type="primary" :plain="!isEdit('full_name')" @click="handleEditClick('full_name')">
              {{ !isEdit('country_id') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店简称设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Store Short Name</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2 items-center">
              <p v-if="!isEdit('short_name')">{{ storeInfo.short_name }}</p>
              <ElInput v-model="storeInfo.short_name" v-else></ElInput>
            </div>
            <div class="w-[500px] text-[#999999]">
              (You can use the abbreviation instead of the store name)
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton type="primary" :plain="!isEdit('short_name')" @click="handleEditClick('short_name')">
              {{ !isEdit('country_id') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店logo设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Store Logo</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              {{ storeInfo.profile_photo }}
            </div>
            <div class="w-[500px] text-[#999999]">
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
          </div>
        </div>
        <!-- ----------门店联系方式设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Store No.</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              {{ storeInfo.contact_country_area_code }}
              {{ storeInfo.contact_telephone }}
            </div>
            <div class="w-[500px] text-[#999999]">
              (Telephone number for guest to contact the store)
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton type="primary" :plain="!isEdit('contact_telephone')"
              @click="handleEditClick('contact_telephone')">
              {{ !isEdit('contact_telephone') ? '编辑' : '保存' }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店国家设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Currency</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              <p v-if="!isEdit('country_id')">{{ storeInfo.country_id }}</p>
              <ElSelect v-model="storeInfo.country_id" v-else>
                <ElOption v-for="item in timezoneList" :key="item.value" :value="item.value">
                  {{ item.label }}
                </ElOption>
              </ElSelect>
            </div>
            <div class="w-[500px] text-[#999999]">
              (Select the country to which the system belongs)
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton type="primary" :plain="!isEdit('country_id')" @click="handleEditClick('country_id')">
              {{ !isEdit('country_id') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店时区设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Time Zone</div>
          <div class="flex gap-10 items-center">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              <p v-if="!isEdit('time_zone_id')">{{ storeInfo.time_zone_id }}</p>
              <ElSelect v-model="storeInfo.time_zone_id" v-else>
                <ElOption v-for="item in timezoneList" :key="item.value" :value="item.value">
                  {{ item.label }}
                </ElOption>
              </ElSelect>
            </div>
            <div class="w-[500px] text-[#999999]">
              (Select the country to which the system belongs)
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton type="primary" :plain="!isEdit('time_zone_id')" @click="handleEditClick('time_zone_id')">
              {{ !isEdit('country_id') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店语言设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Language</div>
          <div class="flex gap-10 items-center">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              <p v-if="!isEdit('language')">
                {{ storeInfo.major_country_language_lang_code + '-' + storeInfo.minor_country_language_lang_code }}</p>
              <div class="flex gap-2 w-full" v-else>
                <ElSelect v-model="storeInfo.major_country_language_lang_code" class="w-full">
                  <ElOption v-for="item in timezoneList" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </ElOption>
                </ElSelect>
                <ElSelect v-model="storeInfo.minor_country_language_lang_code" class="w-full">
                  <ElOption v-for="item in timezoneList" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </ElOption>
                </ElSelect>
              </div>

            </div>
            <div class="w-[500px] text-[#999999]">
              (Please select the language you want to use for entering information, such as the entry of product names)
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton type="primary" :plain="!isEdit('language')" @click="handleEditClick('language')">
              {{ !isEdit('country_id') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店货币设置------------ -->
        <div class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2">
          <div class="w-[230px] font-bold">Currency</div>
          <div class="flex gap-10 items-center">
            <!-- 插槽label -->
            <div class="flex w-[173px] gap-2">
              <p v-if="!isEdit('basic_currency_code')">{{ storeInfo.basic_currency_code }}</p>
              <ElSelect v-model="storeInfo.basic_currency_code" v-else>
                <ElOption v-for="item in timezoneList" :key="item.value" :value="item.value">
                  {{ item.label }}
                </ElOption>
              </ElSelect>
            </div>
            <div class="w-[500px] text-[#999999]">
              (Display store base currency)
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton type="primary" :plain="!isEdit('basic_currency_code')"
              @click="handleEditClick('basic_currency_code')">
              {{ !isEdit('country_id') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
      </section>
    </section>
  </Page>
</template>
