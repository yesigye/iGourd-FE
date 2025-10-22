<script lang="ts" setup>
import type { FormInstance } from 'element-plus';

import { computed, nextTick, onMounted, reactive, ref, toRefs } from 'vue';

import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElSelect,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  basicsMerchantSubMerchantCreate,
  basicsMerchantSubMerchantModify,
} from '@@/store';

import { CurrencyService } from '#/apis/accounting/currency';
import { LoginService } from '#/apis/login';
import { BusinessService } from '#/apis/stores/business';
import { useVaidateHooks } from '#/hooks/useVaidateHooks';

interface PropsType {
  submitBtnText?: string;
  isUpdate?: boolean;
  showSubmit?: boolean;
}

// 定义子组件传递参数，设置默认值
const props = withDefaults(defineProps<PropsType>(), {
  isUpdate: false,
  submitBtnText: 'login.next',
  showSubmit: true,
});

// 主动派发事件
const emits = defineEmits<{
  (e: 'updateStore', storeForm: any): void; // 动态绑定父组件变量
}>();

const { validateSymbolRules } = useVaidateHooks();

const { t } = useI18n();

const {
  currentLoginUserApp: { owner_id: merchantId },
} = useUserStore();

const formRef = ref<FormInstance>();
const state = reactive({
  loading: false,
  storeForm: {
    money_amount_scale: 0,
    quantity_amount_scale: 0,
    business_type: 'RETAIL', // 业务类型(RETAIL:零售,WHOLESALE:批发,RESTAURANT:餐饮,COUNTING_GOODS:点货
    full_name: '', // 商户全称
    short_name: '', // 商户简称
    industry_code: null, // 行业编码
    time_zone_id: null, // 时区的区域ID
    country_id: null, // 国家ID
    actual_address: '', // 	商户实际经营地址
    basic_currency_code: null, // 基础货币code
    major_country_language_lang_code: '', // 商户主语言，国家语言代码.如:zh_CN
    minor_country_language_lang_code: '', // 商户辅语言，国家语言代码.如:en
  },
  businessTypeList: [], // 获取业务类型列表
  industryList: [] as any[], // 获取行业列表
  timezoneList: [] as any[], // 获取时区列表
  countriesList: [] as any[],
  basicCurrencyList: [] as any[], // 货币列表
  countryLanguageList: [] as any[],
});

const { loading, storeForm } = toRefs(state);

const storeRules = computed(() => {
  return {
    business_type: [
      {
        required: true,
        message: t('store-form.business-type.placeholder'),
        trigger: 'change',
      },
    ],
    full_name: [
      {
        required: true,
        message: t('store-form.full-name.placeholder'),
        trigger: 'blur',
      },
      ...validateSymbolRules,
    ],
    short_name: [
      {
        required: true,
        message: t('store-form.short-name.placeholder'),
        trigger: 'blur',
      },
      ...validateSymbolRules,
    ],
    industry_code: [
      {
        required: true,
        message: t('store-form.industry-code.placeholder'),
        trigger: 'change',
      },
    ],
    time_zone_id: [
      {
        required: true,
        message: t('store-form.time-zone-id.placeholder'),
        trigger: 'change',
      },
    ],
    country_id: [
      {
        required: true,
        message: t('store-form.country-id.placeholder'),
        trigger: 'change',
      },
    ],
    actual_address: [
      {
        required: true,
        message: t('store-form.actual-address.placeholder'),
        trigger: 'blur',
      },
      ...validateSymbolRules,
    ],
    basic_currency_code: [
      {
        required: true,
        message: t('store-form.basic-currency-code.placeholder'),
        trigger: 'change',
      },
    ],
    major_country_language_lang_code: [
      {
        required: true,
        message: t('store-form.major-country-language.placeholder'),
      },
    ],
    // minor_country_language_lang_code: [{ required: true, message: t('store-form.minor-country-language.placeholder') }]
  };
});

const montageTimezone = (timeItem: any) => {
  return `(GMT${timeItem.zone_offset_hour})${timeItem.zone_id}(${timeItem.zone_id_name_local})`;
};

const submitForm = async () => {
  try {

    loading.value = true;
    const valid = await formRef.value?.validate();
    if (!valid) return;
    const formData = {
      first_level_merchant_id: merchantId,
      ...storeForm.value,
    } as any;
    const isUpdate = props.isUpdate;
    const api = isUpdate
      ? basicsMerchantSubMerchantModify
      : basicsMerchantSubMerchantCreate;
    return await api(formData).then((data) => {
      emits('updateStore', { isUpdate, ...data, createForm: formData });
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// 表单内容
function setEditForm(formData) {
  formRef.value?.resetFields();
  nextTick(() => {
    storeForm.value = { ...formData };
  });
}

const getBusinessTypeList = async () => {
  state.businessTypeList = await BusinessService.businessTypeList({});
};

const getMerchantIndustryList = async () => {
  state.industryList = await BusinessService.merchantIndustryList({});
};
const businessType = [
  { id: '1', value: 'Catering' },
  { id: '2', value: 'Bakery' },
  { id: '4', value: 'Retail' },
  { id: '5', value: 'Apparel and Footwear' },
  { id: '6', value: 'Fresh Food' },
  { id: '7', value: 'Maternity and Infant' },
  { id: '8', value: 'Beauty' },
  { id: '9', value: 'Arts Training' },
  { id: '10', value: 'Pet' },
  { id: '11', value: 'Life Services' },
  { id: '12', value: 'Wholesale and Trade' },
  { id: '14', value: 'Other' },
];

// 添加一个方法，根据 ID 返回翻译后的值
const getTranslatedValue = (id) => {
  const item = businessType.find((type) => type.id === id);
  return item ? t(`store-industry.${item.value}`) : '';
};

const getTimezoneList = async () => {
  try {
    state.timezoneList = await LoginService.timezone({});
  } catch (error) {
    console.log(error);
  }
};

const getBasicCurrencyList = async () => {
  try {
    state.basicCurrencyList = await CurrencyService.getCurrencyList();
  } catch (error) {
    console.log(error);
  }
};

const getCountryAreas = async () => {
  try {
    state.countriesList = await LoginService.countryAreas({});
  } catch (error) {
    console.log(error);
  }
};

const basicsCountryAnguageList = async () => {
  state.countryLanguageList = await BusinessService.countryLanguagelist({});
};
defineExpose({
  getFileds: () => Object.keys(storeForm.value),
  setEditForm,
  submitForm,
});

onMounted(() => {
  getBusinessTypeList();
  getMerchantIndustryList();
  getTimezoneList();
  getBasicCurrencyList();
  getCountryAreas();
  basicsCountryAnguageList();
});
</script>

<template>
  <div class="Cform">
    <div class="Cform-container">
      <ElForm
        ref="formRef"
        class="Cform-wrapper"
        label-width="200px"
        :model="storeForm"
        :rules="storeRules"
        @submit.native.prevent
      >
        <ElFormItem
          :label="`${$t('store-form.business-type.label')}:`"
          prop="business_type"
        >
          <ElSelect
            v-model="storeForm.business_type"
            :disabled="isUpdate"
            :placeholder="$t('store-form.business-type.placeholder')"
          >
            <ElOption
              v-for="item in state.businessTypeList"
              :key="item"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          :label="`${$t('store-form.full-name.label')}:`"
          prop="full_name"
        >
          <ElInput
            v-model="storeForm.full_name"
            maxlength="64"
            :placeholder="$t('store-form.full-name.placeholder')"
          />
        </ElFormItem>
        <ElFormItem
          :label="`${$t('store-form.short-name.label')}:`"
          prop="short_name"
        >
          <ElInput
            v-model="storeForm.short_name"
            :maxlength="64"
            :placeholder="$t('store-form.short-name.placeholder')"
          />
        </ElFormItem>
        <ElFormItem
          :label="`${$t('store-form.industry-code.label')}:`"
          prop="industry_code"
        >
          <ElSelect
            v-model="storeForm.industry_code"
            :placeholder="$t('store-form.industry-code.placeholder')"
          >
            <ElOption
              v-for="item in state.industryList"
              :key="item.id"
              :label="getTranslatedValue(item.id)"
              :value="item.code"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          :label="`${$t('store-form.time-zone-id.label')}:`"
          prop="time_zone_id"
        >
          <ElSelect
            v-model="storeForm.time_zone_id"
            filterable
            :placeholder="$t('store-form.time-zone-id.placeholder')"
          >
            <ElOption
              v-for="item in state.timezoneList"
              :key="item.hour"
              :label="montageTimezone(item)"
              :value="item.zone_id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          :label="`${$t('store-form.country-id.label')}:`"
          prop="country_id"
        >
          <ElSelect
            v-model="storeForm.country_id"
            filterable
            :placeholder="$t('store-form.country-id.placeholder')"
          >
            <ElOption
              v-for="item in state.countriesList"
              :key="item.code"
              :label="item.name"
              :value="item.country_id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          :label="`${$t('store-form.actual-address.label')}:`"
          prop="actual_address"
        >
          <ElInput
            v-model="storeForm.actual_address"
            type="textarea"
            maxlength="256"
            :show-word-limit="true"
            :placeholder="$t('store-form.actual-address.placeholder')"
            :autosize="{ minRows: 2, maxRows: 2 }"
          />
        </ElFormItem>
        <ElFormItem
          :label="`${$t('store-form.basic-currency-code.label')}:`"
          prop="basic_currency_code"
        >
          <ElSelect
            v-model="storeForm.basic_currency_code"
            :placeholder="$t('store-form.basic-currency-code.placeholder')"
          >
            <ElOption
              v-for="item in state.basicCurrencyList"
              :key="item.name"
              :label="`${item.symbol}&nbsp;${item.name} `"
              :value="item.code"
            >
              <!-- <span class="Cform-currency-name">{{ item.name }}</span> -->
              <span class="Cform-currency-code">{{ item.symbol }}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span class="Cform-currency-name">{{ item.name }}</span>
            </ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          class="Cform-language"
          :label="`${$t('store-form.major-country-language.label')}:`"
          required
        >
          <ElFormItem
            class="Cform-language-item"
            prop="major_country_language_lang_code"
          >
            <ElSelect
              v-model="storeForm.major_country_language_lang_code"
              :placeholder="$t('store-form.major-country-language.placeholder')"
            >
              <ElOption
                v-for="item in state.countryLanguageList"
                :key="item.id"
                :label="item.lang_name_local"
                :value="item.lang_code"
              >
                <span class="Cform-language-item__icon">{{
                  item.lang_code.slice(0, 2)
                }}</span>
                <span class="Cform-language-item__name">{{
                  item.lang_name_local
                }}</span>
              </ElOption>
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            class="Cform-language-item"
            prop="minor_country_language_lang_code"
          >
            <ElSelect
              v-model="storeForm.minor_country_language_lang_code"
              :placeholder="$t('store-form.minor-country-language.placeholder')"
            >
              <ElOption
                v-for="item in state.countryLanguageList"
                :key="item.id"
                :label="item.lang_name_local"
                :value="item.lang_code"
              >
                <span class="Cform-language-item__icon">{{
                  item.lang_code.slice(0, 2)
                }}</span>
                <span class="Cform-language-item__name">{{
                  item.lang_name_local
                }}</span>
              </ElOption>
            </ElSelect>
          </ElFormItem>
        </ElFormItem>
        <ElFormItem prop="money_amount_scale" label="价格精度">
          <ElSelect v-model="storeForm.money_amount_scale">
            <ElOption v-for="i in 4" :key="i" :label="i" :value="i" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem prop="money_amount_scale" label="数量精度">
          <ElSelect v-model="storeForm.quantity_amount_scale">
            <ElOption v-for="i in 8" :key="i" :label="i" :value="i" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <div v-if="showSubmit" class="Cform-next">
        <ElButton
          class="Cform-next-btn"
          type="primary"
          :loading="loading"
          :disabled="loading"
          @click.stop="submitForm"
        >
          {{ $t(submitBtnText) }}
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Cform {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  :deep(.el-form-item__content) {
    width: 100%;
  }

  :deep(.el-form-item__label) {
    margin-right: 10px;
    font-weight: 400;
    color: rgb(50 50 50 / 100%);
  }

  &-container {
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    padding-top: 10px;
    overflow: hidden auto;
  }

  &-wrapper {
    max-width: 700px;
    margin: 0 auto;
  }

  &-currency-name {
    margin-right: 10px;
  }

  &-language {
    & > :deep(.el-form-item__content) {
      display: flex;
      justify-content: space-between;
    }

    &-item {
      width: 49.5%;

      &__icon {
        display: inline-block;
        width: 20px;
        margin-right: 5px;
        font-size: 12px;
        line-height: 20px;
        color: rgb(125 144 178 / 100%);
        text-align: center;
        border: 1px rgb(125 144 178 / 100%) solid;
        border-radius: 2px;
      }
    }
  }

  &-next {
    padding: 32px 0;
    text-align: center;

    &-btn {
      width: 160px;
      height: 50px;
    }
  }
}
</style>
