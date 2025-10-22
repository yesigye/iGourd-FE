<script lang="ts" setup>
import type { Ref } from 'vue';

import type { StoreParamsType } from '../types';

import { computed, inject, reactive, toRefs } from 'vue';

import {
  ElButton,
  ElCol,
  ElRadio,
  ElRadioGroup,
  ElRow,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { getCalc } from '@igourd/utils';

import { basicsMerchantPackagePlaceOrder } from '@@/store';

import StandardCard from './StandardCard.vue';

interface PropsType {
  packagesInfo: any;
  merchantModel: any;
  merchantEnrollModel: any;
}
// 定义子组件传递参数，设置默认值
const props = withDefaults(defineProps<PropsType>(), {
  merchantModel: () => ({}),
  merchantEnrollModel: () => ({}),
  packagesInfo: () => ({
    // 单独拼接数据
    first_install_cost_amount: 0, // 是否首次安装
    total_surplus_amount: 0, // 原始套餐剩余金额
    // 原来的信息
    merchant_package_payment_info: {
      support_accept_banks: [], // 支付方式信息
    },
    package_prepaid_mode_models: [],
  }),
});

const emits = defineEmits<{
  (e: 'placeOrder', orderInfo: any): void; // 动态绑定父组件变量
}>();

const { t } = useI18n();

const storeParams = inject<Ref<StoreParamsType>>('storeParams');

const state = reactive({
  loading: false,
  packActive: 0, // 选择月数
  supportActive: 0, // 支付方式
});
const { loading, packActive, supportActive } = toRefs(state);

const payableItem = computed(() => {
  const prepaidMode = props?.packagesInfo?.package_prepaid_mode_models || [];
  return prepaidMode[packActive.value] || {};
});
const payableList = computed(() => {
  const item = payableItem.value;
  const { first_install_cost_amount, total_surplus_amount } =
    props.packagesInfo;
  const syb = storeParams?.value?.currencySymbol;
  return [
    {
      name: t('store-package.payable-amount'),
      value: `${syb}${item.origin_total_amount || 0}`,
    },
    {
      name: t('store-package.payable-discount'),
      value: `-${syb}${item.discount_amount || 0}`,
    },
    {
      name: t('store-package.payable-fee'),
      value: `${syb}${first_install_cost_amount || 0}`,
    },
    {
      name: t('store-package.payable-origin'),
      value: `${syb}${total_surplus_amount || 0}`,
    },
  ];
});

const totalSumCount = computed(() => {
  const { origin_total_amount = 0, discount_amount = 0 } = payableItem.value;
  const { first_install_cost_amount = 0, total_surplus_amount = 0 } =
    props.packagesInfo;
  return getCalc(
    `${origin_total_amount || 0} - ${discount_amount || 0} + ${first_install_cost_amount || 0} - ${total_surplus_amount || 0}`,
  );
});

// 支付方式列表
const supportAcceptBanks = computed(() => {
  return (
    props?.packagesInfo?.merchant_package_payment_info?.support_accept_banks ||
    []
  );
});

// 选中的支付方式
const supportItem = computed(
  () => supportAcceptBanks.value[supportActive.value] || {},
);

const handleSubmitOrder = () => {
  const { first_install_cost_amount, total_surplus_amount } =
    props.packagesInfo;
  const activeItem = payableItem.value; // 选中套餐下的按月或年～
  const packagesInfo = props.packagesInfo; // 上一步套餐相关的参数
  const merchantModel = props.merchantModel; // 子商户相关信息
  const merchantEnrollModel = props.merchantEnrollModel; // 入网商户相关信息
  const package_business_type = storeParams?.value.package_business_type;
  const params = {
    currency_code: activeItem.currency_code, // 结算货币编码,如：CNY(关联)
    deduction_amount: total_surplus_amount, // 原套餐抵扣金额
    discount_amount: activeItem.discount_amount, // 折扣金额
    first_install_cost_amount: first_install_cost_amount || 0, // 首次安装服务指导费
    merchant_enroll_id: merchantEnrollModel.id, // 商户入网ID, 注：如果packageBusinessType类型为新购，此字段必填.
    package_amount: activeItem.total_amount, // 套餐金额
    package_business_type, // 套餐业务类型(NEW:新购,RENEW:续费复购,UPGRADE:套餐升级)
    package_id: packagesInfo.id, // 套餐ID
    package_prepaid_mode_id: activeItem.id, // 套餐预付费模式ID
    payment_method: supportItem.value.payment_method, // payment_method
    sub_merchant_id: merchantModel.id || storeParams?.value.sub_merchant_id, // 当前要购买套餐的子商户ID
    total_amount: totalSumCount.value, // 订单总金额
    total_pay_amount: totalSumCount.value, // 实际支付总金额(除去优惠券的实际金额)
  };
  sendBasicsMerchantPackagePlaceOrder(params);
};

const sendBasicsMerchantPackagePlaceOrder = async (params) => {
  try {
    loading.value = true;
    const data = await basicsMerchantPackagePlaceOrder(params);

    emits('placeOrder', { ...data, supportAcceptItem: supportItem.value });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="SPack">
    <ElRow :gutter="10" justify="space-between">
      <ElCol :span="16">
        <div class="SPack-discount SPack-card">
          <ElRadioGroup v-model="packActive" class="SPack-discount-ul">
            <ElRadio
              v-for="(item, index) in packagesInfo.package_prepaid_mode_models"
              :key="index"
              class="SPack-discount-li"
              :value="index"
            >
              <span class="SPack-discount-li__title">{{ item.name }}</span>
              <span class="SPack-discount-li__price">
                {{ item.month_amount }} {{ storeParams?.currencySymbol }}/{{
                  $t('store-package.month-amount-unit')
                }}
              </span>
              <span
                v-if="item.discount_percentage"
                class="SPack-discount-li__bage"
              >
                {{ item.discount_percentage }}%
                {{ item.discount_percentage < 0 ? '' : 'off' }}
              </span>
            </ElRadio>
          </ElRadioGroup>
        </div>
        <div class="SPack-payable SPack-card">
          <div class="SPack-payable-title">
            {{ $t('store-package.payable-title') }}:
          </div>
          <div class="SPack-payable-detail">
            <div
              v-for="(item, index) in payableList"
              class="SPack-payable-li"
              :key="index"
            >
              <span class="SPack-payable-li__label">{{ item.name }}:</span>
              <span class="SPack-payable-li__value">{{ item.value }}</span>
            </div>
            <div class="SPack-payable-li SPack-payable__sum">
              <span class="SPack-payable-li__label"
                >{{ $t('store-package.total') }}:</span
              >
              <span class="SPack-payable-li__value">{{ totalSumCount }}</span>
            </div>
          </div>
        </div>

        <div class="SPack-method SPack-card">
          <div class="SPack-method-title">
            {{ $t('store-package.method-title') }}:
          </div>
          <ElRadioGroup v-model="supportActive" class="SPack-discount-ul">
            <ElRadio
              v-for="(item, index) in supportAcceptBanks"
              :key="index"
              class="SPack-discount-li"
              :value="index"
            >
              <span
                class="SPack-discount-li__icon"
                :class="[`${item.payment_method}`]"
                >{{ item.name }}</span
              >
              <span
                v-if="item.payment_method"
                class="SPack-discount-li__remark"
              >
                {{ $t(`storePackage.payment_method_${item.payment_method}`) }}
              </span>
            </ElRadio>
          </ElRadioGroup>
        </div>
        <div class="SPack-place">
          <ElButton
            class="SPack-place-button"
            type="primary"
            @click="handleSubmitOrder"
          >
            {{ $t('store-package.place-button') }}
          </ElButton>
        </div>
      </ElCol>
      <ElCol :span="8">
        <StandardCard
          :standard-info="packagesInfo"
          :status="packagesInfo.id"
          :show-purchase-btn="false"
        />
      </ElCol>
    </ElRow>
  </div>
</template>
<style lang="scss" scoped>
.SPack {
  box-sizing: border-box;
  padding-top: 10px;
  padding-right: 15px;
  padding-left: 8px;

  &-card {
    margin-bottom: 10px;
    background: #f6f9ff;
    border-radius: 4px;
    box-shadow: 2px 4px 5.5px 0 #edf3ff;
  }

  &-discount {
    padding: 14px 15px;

    :deep(.el-radio-group) {
      display: block;
    }

    &-ul {
      display: block;
    }

    &-li {
      display: flex;
      align-items: center;
      height: 42px;
      padding-left: 18px;
      margin-right: 0;
      margin-bottom: 10px;
      font-size: 14px;
      color: #323232;
      background-color: #fff;
      border-radius: 4px;

      &.is-checked {
        background-color: #d9efff;
      }

      :deep(.el-radio__label) {
        display: flex;
        flex: 1;
        align-items: center;
        height: 100%;
        color: #323232;
      }

      &:last-child {
        margin-bottom: 0;
      }

      &__title {
        display: inline-block;
        width: 140px;
      }

      &__price {
        box-sizing: border-box;
        // width: 100px;
        flex: 1;
        padding-left: 50px;
        text-align: right;
      }

      &__bage {
        display: inline-block;
        width: 48px;
        margin-right: 20%;
        margin-left: 20px;
        font-size: 12px;
        line-height: 15px;
        color: #fff;
        text-align: center;
        background: #ff8151;
        border-radius: 2px;
      }

      // --------------------------------
      &__remark {
        padding-left: 10px;
      }

      &__icon {
        display: inline-block;
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        // 不需要支付
        // &.NO_PAYMENT {
        //   // background-image: url(#/assets/img/store/icon-no-payment.png);
        // }
        // 现金支付
        &.CASH {
          background-image: url('#/assets/img/store/CASH.png');
        }

        &.OFFLINE_BANK_TRANSFER {
          background-image: url('#/assets/img/store/OFFLINE_BANK_TRANSFER.png');
        }
      }
    }
  }

  &-payable {
    padding: 8px 15px 10px;

    &-title {
      padding-bottom: 10px;
      font-size: 16px;
    }

    &-detail {
      padding: 0 18px;
      color: #000;
      background-color: #fff;
      border-radius: 4px;
    }

    &-li {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dashed #cfcfcf;

      &:last-child {
        border-bottom: 0;
      }
    }

    &__sum {
      font-size: 16px;
      font-weight: 700;

      .SPack-payable-li__value {
        color: #f00;
      }
    }
  }

  &-method {
    padding: 15px;

    &-title {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 500;
      color: #323232;
    }

    &-offline {
      display: flex;
      align-items: center;
      width: 100%;
      height: auto;
      padding: 18px 20px;
      margin-top: 15px;
      background: #d9efff;
      border-radius: 4px;

      &-image {
        display: inline-block;
        width: 52px;
        height: 52px;
        background-image: url('#/assets/img/store/icon.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      :deep(.el-radio__label) {
        display: inline-flex;
        align-items: center;
      }

      &-text {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 500;
        color: #0052e2;
      }
    }
  }

  &-place {
    padding-top: 16px;
    padding-bottom: 16px;
    text-align: center;

    &-button {
      width: 160px;
      height: 50px;
    }
  }
}
</style>
