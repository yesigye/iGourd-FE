<script setup lang="ts">
import type { SettingStoresetDetail } from '@@/setting/types/storeset';

import { onMounted, ref } from 'vue';

import {
  ElButton,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
  Page,
  Upload,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  getBusinessTypeListApi,
  getCountryLanguageListApi,
  getCountryListApi,
  getCurrencyListApi,
  getIndustryListApi,
  getSettingStoresetDetailApi,
  getTimezoneListApi,
  updateSettingStoresetApi,
} from '@@/setting/apis';

const { t } = useI18n();
const { currentLoginUserApp } = useUserStore();
const storeInfo = ref<SettingStoresetDetail>({});
interface Options {
  label: string;
  value: string;
}

const timezoneList = ref<Options[]>([]);
/**
 * 时区列表
 */
const getTimezoneList = async () => {
  const result = await getTimezoneListApi({});
  timezoneList.value = result.map((item) => ({
    label: `${item.zone_id_name_local}/${item.zone_id_name_cn}`,
    value: item.zone_id,
  }));
};
/**
 * 行业列表
 */
const industryList = ref<Options[]>([]);
const getIndustryList = async () => {
  const result = await getIndustryListApi({});
  industryList.value = result.map((item) => ({
    label: item.name,
    value: item.code,
  }));
};
/**
 * 货币列表
 */
const currencyList = ref<Options[]>([]);
const getCurrencyList = async () => {
  const result = await getCurrencyListApi({});
  currencyList.value = result.map((item) => ({
    label: item.name,
    value: item.code,
  }));
};
/**
 * 国家列表
 */
const countryList = ref<Options[]>([]);
const getCountryList = async () => {
  const result = await getCountryListApi({});
  countryList.value = result.map(
    (item: { country_id: string; name: string }) => ({
      label: item.name,
      value: item.country_id,
    }),
  );
};
/**
 * 店铺类型列表
 */
const businessTypeList = ref<Options[]>([]);
const getBusinessTypeList = async () => {
  const result = await getBusinessTypeListApi({});
  businessTypeList.value = result.map((item) => ({
    label: item,
    value: item,
  }));
};
/**
 * 国家语言列表
 */
const countryLanguageList = ref<Options[]>([]);
const getCountryLanguageList = async () => {
  const result = await getCountryLanguageListApi({});
  countryLanguageList.value = result.map((item) => ({
    label: item.lang_name_local,
    value: item.lang_name_local,
  }));
};

const backUpInfo = ref({});
// 获取门店设置
const getStoreSetting = async () => {
  const result = await getSettingStoresetDetailApi({
    id: currentLoginUserApp.owner_id,
  });
  storeInfo.value = result;
  backUpInfo.value = { ...result };
  // 备份
};
/** 正在编辑的行*/
const editKeyList = ref<string[]>([]);
/** 判断当前行是否处于编辑状态*/
const isEdit = (key: string) => editKeyList.value.includes(key);
const handleEditClick = async (
  key: string,
  multiple: boolean = false,
  keys: string[] = [],
) => {
  if (editKeyList.value.includes(key)) {
    if (multiple) {
      keys.forEach((item) => {
        if (!storeInfo.value[item]) {
          ElMessage.error(t('storeset.please-fill-in-full-information'));
          return false;
        }
      });
    } else {
      if (!storeInfo.value[key]) {
        ElMessage.error(t('storeset.please-fill-in-full-information'));
        return false;
      }
    }

    editKeyList.value = editKeyList.value.filter((item) => item !== key);
    let params = {};
    if (multiple) {
      const newParms = {};
      keys.forEach((item) => {
        newParms[item] = storeInfo.value[item];
      });

      params = {
        ...backUpInfo.value,
        ...newParms,
      };
    } else {
      params = {
        ...backUpInfo.value,
        [key]: storeInfo.value[key],
      };
    }

    await updateSettingStoresetApi(params);
    ElMessage.success('修改成功');
  } else {
    editKeyList.value.push(key);
  }
};
//
onMounted(() => {
  getStoreSetting();
  getTimezoneList();
  getIndustryList();
  getCurrencyList();
  getCountryList();
  getBusinessTypeList();
  getCountryLanguageList();
});
</script>
<template>
  <Page auto-content-height class="p-2">
    <section class="h-full text-sm">
      <div class="mb-4 flex items-center gap-2">
        <div class="bg-primary h-2.5 w-1 rounded-md"></div>
        {{ t('storeset.basic-information') }}
      </div>
      <!-- 设置项 -->
      <section class="bg-card pb-4 pl-5 pr-5 pt-4">
        <!-- ----------设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.version') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              {{ storeInfo.version }}
            </div>
            <div class="w-[500px] text-[#999999]"></div>
          </div>

          <div class="flex min-w-[120px] justify-end"></div>
        </div>

        <!-- ----------设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">
            {{ t('storeset.cash-register-receipt') }}
          </div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              {{ storeInfo?.business_type?.label ?? '--' }}
            </div>
            <div class="w-[500px] text-[#999999]"></div>
          </div>

          <div class="flex min-w-[120px] justify-end"></div>
        </div>
        <!-- ----------设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.validity') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              {{ storeInfo?.package_start_time }} -
              {{ storeInfo?.package_expiration_time }}
            </div>
            <div class="w-[500px] text-[#999999]"></div>
          </div>

          <div class="flex min-w-[120px] justify-end"></div>
        </div>
        <!-- ----------设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">
            {{ t('storeset.registration-time') }}
          </div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              {{ storeInfo.create_time }}
            </div>
            <div class="w-[500px] text-[#999999]"></div>
          </div>

          <div class="flex min-w-[120px] justify-end"></div>
        </div>
        <!-- ----------设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">
            {{ t('storeset.client-sideos') }}
          </div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              {{ t('storeset.pc-windows-pos') }}
            </div>
            <div class="w-[500px] text-[#999999]"></div>
          </div>

          <div class="flex min-w-[120px] justify-end"></div>
        </div>
      </section>
      <div class="mb-4 mt-4 flex items-center gap-2">
        <div class="bg-primary h-2.5 w-1 rounded-md"></div>
        {{ t('storeset.store-settings') }}
      </div>

      <!-- 设置项 -->
      <section class="bg-card pb-4 pl-5 pr-5 pt-4">
        <!-- ----------门店全称设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.store-name') }}</div>
          <div class="flex items-center gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              <p v-if="!isEdit('full_name')">{{ storeInfo.full_name }}</p>
              <ElInput v-model="storeInfo.full_name" v-else />
            </div>
            <div class="w-[500px] text-[#999999]">
              ({{ t('storeset.show-store-name') }})
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton
              type="primary"
              :plain="!isEdit('full_name')"
              @click="handleEditClick('full_name')"
            >
              {{ !isEdit('full_name') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店简称设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">
            {{ t('storeset.store-short-name') }}
          </div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              <p v-if="!isEdit('short_name')">{{ storeInfo.short_name }}</p>
              <ElInput v-model="storeInfo.short_name" v-else />
            </div>
            <div class="w-[500px] text-[#999999]">
              ({{ t('storeset.store-short-name-tip') }})
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton
              type="primary"
              :plain="!isEdit('short_name')"
              @click="handleEditClick('short_name')"
            >
              {{ !isEdit('short_name') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店logo设置------------ -->
        <div
          class="flex h-auto w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.store-logo') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->

            <div class="w-[683px] text-[#999999]">
              <Upload
                v-model:file-list="storeInfo.profile_photo"
                list-type="picture-card"
              />
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton
              type="primary"
              :plain="!isEdit('short_name')"
              @click="handleEditClick('short_name')"
            >
              {{ !isEdit('short_name') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店联系方式设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.store-no') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              <div v-if="!isEdit('contact_telephone')">
                {{ storeInfo.contact_country_area_code }}
                {{ storeInfo.contact_telephone }}
              </div>
              <div class="flex items-center gap-2" v-else>
                <ElSelect v-model="storeInfo.contact_country_area_code" />
                <ElInput v-model="storeInfo.contact_telephone" />
              </div>
            </div>
            <div class="w-[500px] text-[#999999]">
              ({{ t('storeset.store-no-tip') }})
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton
              type="primary"
              :plain="!isEdit('contact_telephone')"
              @click="handleEditClick('contact_telephone')"
            >
              {{
                !isEdit('contact_telephone')
                  ? t('common.edit')
                  : t('common.save')
              }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店国家设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.country') }}</div>
          <div class="flex gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              <p v-if="!isEdit('country_id')">
                {{ storeInfo.country_info?.name }}
              </p>
              <ElSelect key="country_id" v-model="storeInfo.country_id" v-else>
                <ElOption
                  v-for="item in countryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </div>
            <div class="w-[500px] text-[#999999]">
              ({{ t('storeset.country-tip') }})
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton
              type="primary"
              :plain="!isEdit('country_id')"
              @click="handleEditClick('country_id')"
            >
              {{ !isEdit('country_id') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店时区设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.time-zone') }}</div>
          <div class="flex items-center gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              <p v-if="!isEdit('time_zone_id')">{{ storeInfo.time_zone_id }}</p>
              <ElSelect v-model="storeInfo.time_zone_id" v-else>
                <ElOption
                  v-for="item in timezoneList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </div>
            <div class="w-[500px] text-[#999999]">
              ({{ t('storeset.country-tip') }})
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton
              type="primary"
              :plain="!isEdit('time_zone_id')"
              @click="handleEditClick('time_zone_id')"
            >
              {{
                !isEdit('time_zone_id') ? t('common.edit') : t('common.save')
              }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店语言设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.language') }}</div>
          <div class="flex items-center gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              <p v-if="!isEdit('language')">
                {{
                  `${storeInfo.major_country_language_lang_code}--${storeInfo.minor_country_language_lang_code}`
                }}
              </p>
              <div class="flex w-full gap-2" v-else>
                <ElSelect
                  v-model="storeInfo.major_country_language_lang_code"
                  class="w-full"
                >
                  <ElOption
                    v-for="item in countryLanguageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
                <ElSelect
                  v-model="storeInfo.minor_country_language_lang_code"
                  class="w-full"
                >
                  <ElOption
                    v-for="item in countryLanguageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
            </div>
            <div class="w-[500px] text-[#999999]">
              ({{ t('storeset.language-tip') }})
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton
              type="primary"
              :plain="!isEdit('language')"
              @click="
                handleEditClick('language', true, [
                  'major_country_language_lang_code',
                  'minor_country_language_lang_code',
                ])
              "
            >
              {{ !isEdit('language') ? t('common.edit') : t('common.save') }}
            </ElButton>
          </div>
        </div>
        <!-- ----------门店货币设置------------ -->
        <div
          class="flex h-12 w-full items-center justify-between border-b border-solid border-[#E4E7ED] pb-2 pt-2"
        >
          <div class="w-[230px] font-bold">{{ t('storeset.currency') }}</div>
          <div class="flex items-center gap-10">
            <!-- 插槽label -->
            <div class="flex w-[173px] items-center gap-2">
              <p v-if="!isEdit('basic_currency_code')">
                {{ storeInfo.basic_currency_code }}
              </p>
              <ElSelect v-model="storeInfo.basic_currency_code" v-else>
                <ElOption
                  v-for="item in currencyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </div>
            <div class="w-[500px] text-[#999999]">
              ({{ t('storeset.currency-tip') }})
            </div>
          </div>

          <div class="flex min-w-[120px] justify-end">
            <ElButton
              type="primary"
              :plain="!isEdit('basic_currency_code')"
              @click="handleEditClick('basic_currency_code')"
            >
              {{
                !isEdit('basic_currency_code')
                  ? t('common.edit')
                  : t('common.save')
              }}
            </ElButton>
          </div>
        </div>
      </section>
    </section>
  </Page>
</template>
