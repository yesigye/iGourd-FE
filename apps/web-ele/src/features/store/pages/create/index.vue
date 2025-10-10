<script setup lang="ts">
// import type { StoreParamsType } from './types';
import {
  computed,
  nextTick,
  onDeactivated,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
} from 'vue';
import { useRequest } from 'vue-request';
import { useRoute, useRouter } from 'vue-router';

import {} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import {
  basicsMerchantMerchantEnrollFind,
  basicsMerchantPackageList,
} from '@@/store/apis';

import { initializeCurrencySymbol } from '#/utils/sale';

import StoreComplete from './components/StoreComplete.vue';
import StoreCreateForm from './components/StoreCrateForm.vue';
import StoreEdition from './components/StoreEdition.vue';
import StorePackage from './components/StorePackage.vue';
import StorePayment from './components/StorePayment.vue';
import StoreSetp from './components/StoreSetp.vue';
import { ContentEnum } from './index.config';

const {
  currentLoginUserApp: { owner_id: merchantId },
} = useUserStore();
const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const state = reactive({
  pageLoading: false,
  setpActive: undefined as any,
  currencySymbol: '', // 基础货币符号

  supportAcceptItem: {} as any, // 选择的套餐信息

  merchantModel: {} as any, // 商户基本信息
  merchantOrder: {} as any, // 付款信息
  merchantEnrollModel: {} as any, // 入网信息
  merchantOrderPayment: {} as any, // 订单信息
  curPackageModel: {} as any, // asd
  curMerchantPackageModel: {} as any,
});
const {
  pageLoading,
  setpActive,
  currencySymbol,
  supportAcceptItem,
  merchantModel,
  merchantOrder,
  merchantEnrollModel,
  merchantOrderPayment,
} = toRefs(state);

const storeParams = computed(() => {
  const {
    sub_merchant_id,
    package_business_type = 'NEW',
    business_type,
  } = route.query;
  return {
    sub_merchant_id,
    package_business_type,
    business_type, // 商户类型
    currencySymbol: currencySymbol.value,
  };
});

provide('storeParams', storeParams);

const setState = (response) => {
  state.curMerchantPackageModel = response.cur_merchant_package_model || {};
  state.curPackageModel = response.cur_package_model || {};
  state.merchantModel = response.merchant_model || {};
  state.merchantOrder = response.merchant_order || {};
  state.merchantEnrollModel = response.merchant_enroll_model || {};
  state.merchantOrderPayment = response.merchant_order_payment || {};
};

const setSetpNumber = (num: number) => {
  nextTick(() => (setpActive.value = num));
};

// 第一步：填写完基本信息之后进入下一步选择套餐
const onCreateStore = (formData) => {
  const { id: sub_merchant_id, business_type } = formData.merchant_model;
  router.replace({
    path: route.path,
    query: { sub_merchant_id, business_type },
  });
  state.merchantModel = formData.merchant_model;
  state.merchantEnrollModel = formData.merchant_enroll_model;
  // createForm.value = formData;
  setSetpNumber(1);
};
const priceEditionId = ref('');
// 第二步：选择套餐之后进入下一步选择按月按年付费
const onSelectPackages = (id: string) => {
  priceEditionId.value = id;
  setSetpNumber(2);
};
const packagesInfo = computed(() => {
  const checkedEditionInfo = priceEdition.value?.packages?.find(
    (item) => item.id === priceEditionId.value,
  );

  if (!checkedEditionInfo) return {};
  return { ...priceEdition.value, ...checkedEditionInfo };
});

// 第三步：选择按月按年付费之后进入银行卡号确认步骤
const onPlaceOrderEvent = (merchantItem) => {
  state.supportAcceptItem = merchantItem.supportAcceptItem;
  state.merchantOrder = merchantItem.merchant_order;
  state.merchantOrderPayment = merchantItem.merchant_order_payment;
  state.curMerchantPackageModel = merchantItem.cur_merchant_package_model;
  merchantItem.merchant_enroll_model &&
    (state.merchantEnrollModel = merchantItem.merchant_enroll_model);
  setSetpNumber(3);
};

const onPaymentMethod = (supportItem) => {
  state.supportAcceptItem = supportItem; // 设置支付方式
};

// 确认已经支付后回调
const onPlaceOrderSuccess = (data) => {
  state.merchantEnrollModel = data.merchant_enroll_model;
};

// 获取步骤
const getBasicsMerchantMerchantEnrollFind = async (params) => {
  try {
    pageLoading.value = true;
    const first_level_merchant_id = merchantId;
    return await basicsMerchantMerchantEnrollFind({
      ...params,
      first_level_merchant_id,
      merchant_id: undefined,
    });
  } catch (error) {
    setpActive.value = 0;
    console.log('获取店铺购买版本详情报错', error);
    // initMethods();
  } finally {
    pageLoading.value = false;
  }
};
const { data: priceEdition } = useRequest(
  async () => {
    try {
      const merchantModel = state.merchantModel;
      const merchantEnrollModel = state.merchantEnrollModel;

      if (
        (!merchantModel.id || !merchantEnrollModel.id) &&
        (!storeParams.value?.sub_merchant_id ||
          !storeParams.value?.package_business_type)
      ) {
        return;
      }
      const res = await basicsMerchantPackageList({
        merchant_enroll_id: merchantEnrollModel.id,
        // 升级套餐仅需下面参数
        sub_merchant_id: merchantModel.id || storeParams?.value.sub_merchant_id,
        merchant_business_type:
          merchantModel.business_type || storeParams?.value?.business_type,
        package_business_type: storeParams?.value.package_business_type,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  {
    refreshDeps: [merchantModel, merchantEnrollModel, locale, storeParams],
    ready: state.merchantModel.id && state.merchantEnrollModel.id,
  },
);

const initMethods = async () => {
  try {
    const { sub_merchant_id, package_business_type } = storeParams.value;
    if (sub_merchant_id) {
      const data = await getBasicsMerchantMerchantEnrollFind({
        sub_merchant_id,
        package_business_type,
      });
      if (package_business_type === 'NEW') {
        setState(data);
        setSetpNumber(
          ContentEnum[data.merchant_enroll_model.current_step] || 0,
        );
      } else if (
        ['RENEW', 'UPGRADE'].includes(package_business_type as string)
      ) {
        if (data) {
          // 升级如果查询到参数，说明升级已经下单，直接进入相应步骤
          setState(data);
          setSetpNumber(ContentEnum[data.merchant_enroll_model.current_step]);
        } else {
          // 升级如果没有查询到参数，说明没有下单，直接进入第二步
          setSetpNumber(1); // 升级从第二步开始
        }
      }
    } else {
      setSetpNumber(0); // 新建商户从第一步开始 17552
    }
    // currencySymbol.value = await initializeCurrencySymbol(sub_merchant_id);
    currencySymbol.value = await initializeCurrencySymbol();
  } catch (error) {
    console.log(error);
  }
};

onMounted(initMethods);
onDeactivated(initMethods);
</script>
<template>
  <div class="Cstore">
    <StoreSetp :setp-active="setpActive" />
    <div class="Cstore-content">
      <StoreCreateForm v-if="setpActive === 0" @update-store="onCreateStore" />
      <StoreEdition
        v-else-if="setpActive === 1"
        :merchant-model="merchantModel"
        :merchant-enroll-model="merchantEnrollModel"
        :price-edition="priceEdition"
        @select-packages="onSelectPackages"
      />
      <StorePackage
        v-else-if="setpActive === 2"
        :merchant-model="merchantModel"
        :merchant-enroll-model="merchantEnrollModel"
        :packages-info="packagesInfo"
        @place-order="onPlaceOrderEvent"
      />
      <StorePayment
        v-else-if="setpActive === 3"
        :merchant-model="merchantModel"
        :merchant-order="merchantOrder"
        :support-accept-item="supportAcceptItem"
        :merchant-enroll-model="merchantEnrollModel"
        :merchant-order-payment="merchantOrderPayment"
        @payment-method="onPaymentMethod"
        @place-success="onPlaceOrderSuccess"
      />
      <StoreComplete
        v-else-if="setpActive === 4"
        :merchant-enroll-model="merchantEnrollModel"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.Cstore {
  // display: flex;
  // flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  // background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgb(0 92 255 / 18%);

  &-content {
    width: 100%;
    height: calc(100vh - 220px);
    overflow-y: auto;
    // flex: 1;
    background-color: #fff;
  }
}
</style>
