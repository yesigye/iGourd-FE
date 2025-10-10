<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue';

import { ElButton, ElCheckbox, ElInput, ElMessage } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { OrderService } from '@/apis';
import { Local } from '@/utils';
import { initializeCurrencySymbol } from '@/utils/helpers/global';
import { ElMessage } from 'element-plus';

const props = defineProps({
  isDialogOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:close', 'handleEmpty']);
const { t } = useI18n();
const printObj = {
  ids: '#receiptPrintId5',
  popTitle: '页面打印',
};

interface Props {
  rowSelection: any[];
  compuredReturnedinfo: {};
  createReturedInfo: {};
}

const isSettled = ref(false); // 跟踪是否已经结算
const wipedAmount = ref(0);
const paymentMethod = ref(false);
const selectedPayments = ref<string[]>(['cash']); // Initialize with cash selected
const card = ref(0);
const third_party = ref(0);
const cash = ref(0);
const balance = ref(0);
const currentSymbol = ref('');
const compuredReturnedinfo = inject<Props>('compuredReturnedinfo');
const createReturedInfo = inject<Props>('createReturedInfo');
const isPrintEnabled = ref(false);
const isSettlementCompleted = ref(false);

const cashInput = ref<HTMLInputElement | null>(null);

watch(
  () => compuredReturnedinfo.value?.total_amount,
  (newVal) => {
    if (newVal) {
      cash.value = newVal;
    }
  },
  { immediate: true },
);

const isSettlementDisabled = computed(() => {
  return tenderedAmount.value <= 0 || isSettlementCompleted.value;
});

const focusCashInput = () => {
  setTimeout(() => {
    if (cashInput.value && cashInput.value.$el) {
      const input = cashInput.value.$el.querySelector('input');
      if (input) {
        input.focus();
        input.select();
      }
    }
  }, 200);
};

onMounted(async () => {
  currentSymbol.value = await initializeCurrencySymbol();
  if (compuredReturnedinfo.value?.total_amount) {
    cash.value = compuredReturnedinfo.value.total_amount;
    focusCashInput();
  }
});

const isPaymentDisabled = computed(() => {
  return paymentMethod.value
    ? selectedPayments.value.length >= 2
    : selectedPayments.value.length > 0;
});

const handleClose = () => {
  selectedPayments.value = ['cash'];
  cash.value = compuredReturnedinfo.value?.total_amount || 0;
  third_party.value = 0;
  card.value = 0;
  balance.value = 0;
  wipedAmount.value = 0;
  emit('update:close');
};
const resetState = () => {
  isPrintEnabled.value = false;
  isSettlementCompleted.value = false;
};
watch(
  () => compuredReturnedinfo,
  (newVal) => {
    if (newVal) {
      // 当有新的订单数据时，重置状态
      resetState();
      if (newVal.total_amount) {
        cash.value = newVal.total_amount;
        if (!selectedPayments.value.includes('cash')) {
          selectedPayments.value = ['cash'];
        }
        focusCashInput();
      }
    }
  },
  { immediate: true },
);
watch(paymentMethod, (newValue) => {
  selectedPayments.value = ['cash'];
  cash.value = compuredReturnedinfo.value?.total_amount || 0;
  third_party.value = 0;
  card.value = 0;
  balance.value = 0;
});

watch(
  () => props.isDialogOpen,
  (newVal) => {
    if (newVal) {
      focusCashInput();
    }
  },
);

// 计算 Tendered 值的计算属性
const tenderedAmount = computed(() => {
  if (paymentMethod.value) {
    // 混合支付方式
    return selectedPayments.value.reduce((total, method) => {
      switch (method) {
        case 'balance': {
          return total + balance.value;
        }
        case 'card': {
          return total + card.value;
        }
        case 'cash': {
          return total + cash.value;
        }
        case 'third_party': {
          return total + third_party.value;
        }
        default: {
          return total;
        }
      }
    }, 0);
  } else {
    // 单一支付方式
    return cash.value + third_party.value + card.value + balance.value;
  }
});

// 修改 handlePaymentChange 函数
const handlePaymentChange = (type: string, inputValue: string) => {
  let cleanValue = inputValue.replaceAll(/[^\d.]/g, '');

  const firstDotIndex = cleanValue.indexOf('.');
  if (firstDotIndex !== -1) {
    cleanValue =
      cleanValue.slice(0, Math.max(0, firstDotIndex + 1)) +
      cleanValue.slice(Math.max(0, firstDotIndex + 1)).replaceAll('.', '');
  }

  if (cleanValue.includes('.')) {
    const [integerPart, decimalPart] = cleanValue.split('.');
    cleanValue = `${integerPart}.${decimalPart.slice(0, 2)}`;
  }

  // Add cash input validation

  switch (type) {
    case 'balance': {
      balance.value = cleanValue;
      break;
    }
    case 'card': {
      card.value = cleanValue;
      break;
    }
    case 'cash': {
      cash.value = cleanValue;
      break;
    }
    case 'third_party': {
      third_party.value = cleanValue;
      break;
    }
  }
  const numValue = Number.parseFloat(cleanValue) || 0;
  if (type === 'cash' && numValue > compuredReturnedinfo.value.total_amount) {
    ElMessage.warning('输入金额不能大于退款总额！');
    cash.value = 0;
    return;
  }

  if (numValue > 0) {
    if (!selectedPayments.value.includes(type)) {
      selectedPayments.value.push(type);
    }
  } else {
    selectedPayments.value = selectedPayments.value.filter(
      (item) => item !== type,
    );
  }
};

// 结算参数
const settlementParams = ref({
  order_returned_no: '', // 退款单号
  merchant_id: 0, // 商户ID
  payment_balance_amount: 0, // 余额
  payment_card_amount: 0, // 卡支付
  payment_card_type: 'CREDIT_CARD', // 卡类型
  payment_cash_amount: 0, // 现金支付
  payment_method: [], // 支付方式
  payment_third_party_amount: 0, // 第三方支付
  payment_third_party_type: 'ALIPAY', // 第三方支付类型
});
// 置空结算数据
const resetSettlementData = () => {
  cash.value = compuredReturnedinfo.value?.total_amount || 0;
};
// 结算
const handleSettlement = async () => {
  settlementParams.value.order_returned_no =
    createReturedInfo.value.order_returned_no;
  settlementParams.value.merchant_id =
    Local.get('userinfo')?.current_login_user_app?.owner_id;
  // 将 selectedPayments 转换为数组且为大写
  settlementParams.value.payment_method = selectedPayments.value.map((item) =>
    item.toUpperCase(),
  ) as never[];
  settlementParams.value.payment_cash_amount = cash.value;
  settlementParams.value.payment_card_amount = card.value;
  settlementParams.value.payment_third_party_amount = third_party.value;
  settlementParams.value.payment_balance_amount = balance.value;
  settlementParams.value.order_returned_no =
    createReturedInfo.value.order_returned_no;
  // settlementParams.value.cash_change_amount = parseFloat(changeAmount.value);
  try {
    const res = await OrderService.orderRefundOffline(settlementParams.value);
    if (String(res.code) === 'SUCCESS') {
      ElMessage.success(res.message);
      isPrintEnabled.value = true;
      isSettlementCompleted.value = true;
      emit('handleEmpty');
      emit('update:close');
      handleClose();
    } else {
      ElMessage.error(res.message);
    }
  } catch (error: any) {
    ElMessage.error(error.message);
  }
};
</script>
<template>
  <div class="scan-cash-settlement">
    <div class="scan-cash-settlement-payment">
      <span class="scan-cash-settlement-payment-title"
        >{{ t('sales.refundMethod') }}:</span
      >
      <div class="scan-cash-settlement-payment-method">
        <ElCheckbox v-model="paymentMethod" disabled>
          {{ t('sales.mixRefund') }}
        </ElCheckbox>
      </div>
      <div class="scan-cash-settlement-payment-form">
        <div class="scan-cash-settlement-payment-form-box">
          <span class="scan-cash-settlement-payment-form-box-cash"
            >{{ t('sales.cash') }}:</span
          >
          <ElInput
            ref="cashInput"
            v-model="cash"
            :disabled="isPaymentDisabled && !selectedPayments.includes('cash')"
            @input="(val) => handlePaymentChange('cash', val)"
          >
            <template #suffix>
              <span>{{ currentSymbol }}</span>
            </template>
          </ElInput>
        </div>
        <div class="scan-cash-settlement-payment-form-box">
          <span class="scan-cash-settlement-payment-form-box-title"
            >{{ t('sales.mobilePay') }}:</span
          >
          <!-- :disabled="isPaymentDisabled && !selectedPayments.includes('third_party')" -->
          <ElInput
            v-model="third_party"
            :disabled="true"
            @input="(val) => handlePaymentChange('third_party', val)"
          >
            <template #suffix>
              <span>{{ currentSymbol }}</span>
            </template>
          </ElInput>
        </div>
      </div>
      <div class="scan-cash-settlement-payment-form" style="margin-top: 20px">
        <div class="scan-cash-settlement-payment-form-box">
          <span class="scan-cash-settlement-payment-form-box-cash"
            >{{ t('sales.card') }}:</span
          >
          <!-- :disabled="isPaymentDisabled && !selectedPayments.includes('card')" -->

          <ElInput
            v-model="card"
            :disabled="true"
            @input="(val) => handlePaymentChange('card', val)"
          >
            <template #suffix>
              <span>{{ currentSymbol }}</span>
            </template>
          </ElInput>
        </div>
        <div class="scan-cash-settlement-payment-form-box">
          <span class="scan-cash-settlement-payment-form-box-title"
            >{{ t('sales.balance') }}:</span
          >
          <!-- :disabled="isPaymentDisabled && !selectedPayments.includes('balance')" -->
          <!--  -->
          <ElInput
            v-model="balance"
            :disabled="true"
            @input="(val) => handlePaymentChange('balance', val)"
          >
            <template #suffix>
              <span>{{ currentSymbol }}</span>
            </template>
          </ElInput>
        </div>
      </div>
    </div>
    <div class="scan-cash-settlement-change">
      <span class="scan-cash-settlement-change-title"
        >{{ t('sales.refund') }}:</span
      >
      <span class="scan-cash-settlement-change-amount"
        >{{ compuredReturnedinfo.total_amount }} {{ currentSymbol }}</span
      >
    </div>
    <div class="scan-cash-settlement-button">
      <ElButton
        v-printv1="printObj"
        class="scan-cash-settlement-button-print"
        :disabled="!isPrintEnabled"
      >
        {{ t('sales.print') }}
      </ElButton>
      <!-- <el-button class="scan-cash-settlement-button-open" :disabled="!isPrintEnabled">
        {{ t('sales.openBox') }}
      </el-button> -->
      <!-- :disabled="isSettlementDisabled"
        :class="{ 'is-disabled': isSettlementDisabled }" -->
      <ElButton
        class="scan-cash-settlement-button-settlement"
        @click="handleSettlement"
      >
        {{ t('sales.refund') }}
      </ElButton>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.scan-cash-settlement {
  position: relative; // 添加相对定位
  height: 97%;

  &-payment {
    height: 200px;
    padding: 0 20px;
    margin: 10px 16px;
    background: #fff;

    &-title {
      width: 100%;
      height: 39px;
      padding-left: 5px;
      font-size: 20px;
      color: #000;
      border-left: 3px solid #0d99ff;
    }

    &-method {
      margin-top: 20px;
    }

    &-form {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      color: #333;

      &-box {
        display: flex;
        justify-content: space-between;

        &-cash {
          width: 100px;
          padding-top: 5px;
          padding-right: 10px;
          font-weight: 600;
        }

        &-title {
          width: 150px;
          // font-size: 24px;
          font-weight: 600;
        }
      }

      &-box:nth-child(2) {
        margin-left: 20px;
      }

      &-item {
        display: flex;
        align-items: center;
      }
    }
  }

  &-change {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100px;
    padding: 0 20px;
    margin: 0 16px 10px;
    background: #fff;

    &-title {
      font-size: 24px;
      font-weight: 600;
      color: #ff8151;
    }

    &-amount {
      font-size: 32px;
      font-weight: 600;
      color: #ff6060;
    }
  }

  &-button {
    position: absolute; // 使用绝对定位
    right: 16px; // 右边距
    bottom: 0; // 距离底部的距离
    left: 16px; // 左边距
    display: flex;
    justify-content: space-between;

    &-print,
    &-open {
      &:disabled {
        cursor: not-allowed;
        background: #c0c4cc;
      }
    }

    &-settlement {
      &.is-disabled {
        cursor: not-allowed;
        background: #c0c4cc;
      }
    }

    :deep(.el-button) {
      flex: 1; // 让按钮均匀分配空间
      height: 50px;
      margin: 0 10px; // 按钮之间的间距

      &:first-child {
        margin-left: 0; // 第一个按钮左边距为 0
      }

      &:last-child {
        margin-right: 0; // 最后一个按钮右边距为 0
      }
    }

    &-print {
      color: #fff;
      background: #dbe8ff;
    }

    &-open {
      color: #fff;
      background: #ff8151;
    }

    &-settlement {
      color: #fff;
      background: #fc5c65;

      &.is-disabled {
        color: #fff;
        cursor: not-allowed;
        background: #c0c4cc; // 灰色背景
      }
    }
  }
}
</style>
