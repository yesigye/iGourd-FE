<script lang="ts" setup>
import type { Ref } from 'vue';

import type { StoreParamsType } from '../types';

import { computed, inject, onMounted, ref } from 'vue';

import { ElButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { basicsMerchantPackageList, basicsMerchantPackagePaid } from '@@/store';
import { ElMessage } from 'element-plus';

import { userClipboard } from '#/hooks/userClipboard';

import StoreComplete from './StoreComplete.vue';

interface PropsType {
  merchantModel: any;
  merchantEnrollModel: any;
  merchantOrder: any;
  merchantOrderPayment: any;
  supportAcceptItem: any;
}
// 定义子组件传递参数，设置默认值
const props = withDefaults(defineProps<PropsType>(), {
  merchantModel: () => ({}),
  merchantOrder: () => ({}),
  merchantEnrollModel: () => ({}),
  merchantOrderPayment: () => ({}),
  supportAcceptItem: () => ({}),
});
// 主动派发事件
const emits = defineEmits<{
  (e: 'confirm-pay', info: any): void; // 确认支付
  (e: 'payment-method', info: any): void; // 设置支付方式
  (e: 'place-success', info: any): void; // 设置支付方式
}>();
const { t } = useI18n();
const { setClipboardData } = userClipboard();
const storeParams = inject<Ref<StoreParamsType>>('storeParams');
const loading = ref(false);
const isShowPay = ref(false);
const isShowComplete = computed(() => {
  const enroll_status = props.merchantEnrollModel.enroll_status;
  // 审核拒绝或者已支付，则展示完成页面
  if (['PENDING', 'REJECTED'].includes(enroll_status) && !isShowPay.value) {
    return true;
  }
  return false;
});

const payableList = computed(() => {
  const accept_bank_accounts =
    props.supportAcceptItem?.accept_bank_accounts || [];
  const bankInfo = accept_bank_accounts[0];
  if (!bankInfo) return [];
  const syb = storeParams?.value?.currencySymbol;
  const amount = props.merchantOrderPayment.amount;
  return [
    {
      name: `${t('store-payment.pay-amount')} (${syb})`,
      value: `${syb}${amount}`,
    },
    {
      name: t('store-payment.accpet-bank'),
      value: bankInfo.bank_name,
      describe: t('store-payment.accpet-bank-sub'),
    },
    {
      name: t('store-payment.accpet-accmout'),
      value: bankInfo.bank_account_number,
      copyText: t('store-payment.copy-account'),
    },
    { name: t('store-payment.swift-code'), value: bankInfo.bank_swift_code },
    { name: t('store-payment.recipient'), value: bankInfo.bank_account_name },
  ];
});

const hanlePlaceBack = () => {
  isShowPay.value = true;
};

const copyData = (text: string) => {
  setClipboardData({
    data: text,
    success() {
      ElMessage.success(t('store-payment.copy-success'));
    },
  });
};

const sendBasicsMerchantPackagePaid = async (params) => {
  try {
    loading.value = true;
    const data = await basicsMerchantPackagePaid(params);
    isShowPay.value = false;
    // eslint-disable-next-line vue/custom-event-name-casing
    emits('place-success', data);
  } finally {
    loading.value = false;
  }
};

function handleSubmit() {
  // const merchantModel = props.storeForm.merchant_model;
  const merchantOrder = props.merchantOrder || {};
  const merchantOrderPayment = props.merchantOrderPayment || {};
  const merchantEnrollModel = props.merchantEnrollModel || {};
  const params = {
    merchant_enroll_id: merchantEnrollModel.id, //*	integer($int64) // 商户入网ID
    merchant_order_id:
      merchantOrder.id || merchantEnrollModel.merchant_order_id, //*	integer($int64)商户订单ID
    merchant_order_pay_id: merchantOrderPayment.id, //*	integer($int64)商户订单支付ID
  };
  sendBasicsMerchantPackagePaid(params);
}

// 设置支付方式
function sendBasicsMerchantPackage(data) {
  const supportAcceptBanks =
    data?.merchant_package_payment_info?.support_accept_banks || [];
  const payment_method = props.merchantOrderPayment.payment_method;
  const supportAcceptItem = supportAcceptBanks.find(
    (item) => item.payment_method === payment_method,
  );
  emits('payment-method', supportAcceptItem);
}

// 查找套餐匹配支付方式
const getBasicsMerchantPackageList = async () => {
  try {
    loading.value = true;
    const { id, business_type } = props.merchantModel;
    const { data } = await basicsMerchantPackageList({
      sub_merchant_id: id,
      merchant_business_type: business_type,
      package_business_type: storeParams?.value.package_business_type,
      merchant_enroll_id: props.merchantEnrollModel.id,
    });
    sendBasicsMerchantPackage(data || {});
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 如果没有支付方式信息，则请求获取套餐数据，从 merchant_order_payment.payment_method
  if (!props.supportAcceptItem?.payment_method) {
    getBasicsMerchantPackageList();
  }
});
</script>

<template>
  <div class="Pay">
    <!-- 如果当前状态为 INIT 则等待审核 -->
    <!-- === 'PENDING'" -->
    <template v-if="isShowComplete">
      <StoreComplete
        :merchant-enroll-model="merchantEnrollModel"
        @place-back="hanlePlaceBack"
      />
    </template>
    <!-- 否则走展示对应的银行信息，或者提示信息 -->
    <template v-else>
      <!-- 银行卡打款，展示银行信息 -->
      <template
        v-if="merchantOrderPayment.payment_method === 'OFFLINE_BANK_TRANSFER'"
      >
        <div class="Pay-container">
          <div class="Pay-wrapper">
            <div
              class="Pay-info"
              v-for="(item, index) in payableList"
              :key="index"
            >
              <div class="Pay-info-block">
                <span class="Pay-info-block__label">{{ item.name }}:</span>
                <span class="Pay-info-block__value">{{ item.value }}</span>
                <span
                  class="Pay-info-block__copy"
                  v-if="item.copyText"
                  @click="copyData(item.value)"
                >
                  {{ item.copyText }}
                </span>
              </div>
              <div class="Pay-info-describe">{{ item.describe || '' }}</div>
            </div>
          </div>
        </div>
      </template>
      <!-- v-else -->
      <template v-else-if="merchantOrderPayment.payment_method === 'CASH'">
        <!-- sub_merchant_id=1852680469330530305 -->
        <!-- 线下支付，展示确认支付完信息 -->
        <div class="Pay-container">
          <dl class="Pay-frame">
            <dt class="Pay-frame-icon"></dt>
            <dd class="Pay-frame-message">
              {{ $t('store-payment.frame-message') }}
            </dd>
          </dl>
        </div>
      </template>
      <div class="Pay-footer">
        <ElButton type="primary" class="Pay-footer-btn" @click="handleSubmit">
          {{ $t('store-payment.paid-already') }}
        </ElButton>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.Pay {
  padding-top: 34px;

  &-container {
    display: flex;
    justify-content: center;
  }

  &-info {
    margin-bottom: 20px;

    &-block {
      font-size: 18px;
      line-height: 25px;

      &__label,
      &__value {
        display: inline-block;
      }

      &__label {
        width: 230px;
        font-weight: 400;
        color: #000;
        text-align: right;
      }

      &__value {
        padding-left: 15px;
        font-weight: 400;
        color: #323232;
      }

      &__copy {
        margin-left: 15px;
        color: #005cff;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &-describe {
      padding-top: 4px;
      padding-left: 130px;
      font-size: 14px;
      line-height: 20px;
      color: #999;
    }
  }

  &-frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;

    &-icon {
      width: 100px;
      height: 100px;
      background-image: url('#/assets/img/store/frame.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    &-message {
      margin-top: 43px;
      font-size: 20px;
      color: #000;
    }
  }

  &-footer {
    margin-top: 150px;
    text-align: center;

    &-btn {
      width: 160px;
      height: 50px;
    }
  }
}
</style>
