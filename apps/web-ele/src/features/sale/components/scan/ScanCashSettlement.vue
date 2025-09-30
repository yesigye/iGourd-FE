<script setup lang="ts">
import type {
  MerchantPaymentMethodConfigModelAddPayField,
  PaymentInputType,
  PaymentInputTypeKey,
  PaymentWay,
  WIPED_AMOUNT_INPUT_KEY,
} from '@@/sale/types';

import {
  computed,
  defineProps,
  inject,
  nextTick,
  provide,
  ref,
  toRefs,
  watch,
  watchEffect,
} from 'vue';

import { useI18n } from '@igourd/locales';

import {
  createCreditApi,
  getOrderDetailApi,
  getOrderPaymentMethodConfigListApi,
  offlinePayApi,
} from '@@/sale/apis';
import { PaymentMethodEnum } from '@@/sale/types';
import Decimal from 'decimal.js';
import { ElMessage } from 'element-plus';

import { addDecimal, subtractDecimal } from '#/utils/decimal.serice';
import { initializeCurrencySymbol } from '#/utils/sale';

const props = defineProps({
  detail: {
    type: Object,
    default: () => ({}),
  },
  showDialog: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  'settlement-success',
  'update:close',
  'handleEmpty',
  'hanleSettledShow',
  'update:detail',
  'close-drawer',
]);

const { detail, showDialog } = toRefs(props);

const printObj = {
  ids: 'receiptPrintId3',
  popTitle: '页面打印',
};
const customer = inject<any>('customerInfo');
const { t } = useI18n();
const calculateOrderList = inject<any>('calculateOrderList');
/** 抹零金额 */
const wipedAmount = ref(0);
const paymentMethod = ref(false);
const balance = ref<number | string>('');
const settlementData = ref(null);
const isPrintEnabled = ref(false);
/** 是否结算完成 */
const isSettlementCompleted = ref(false);
const orderData = inject<any>('orderData');
const isSettled = ref(false);
const wipedAmountInput = ref(null);
/** 所有支付方式输入框的ref */
const paymentInput = ref<Record<PaymentMethodEnum, typeof ElInput>>({});
/** 用户当前修改的输入框 */
const activeInputKey = ref<PaymentInputTypeKey>();
const paymentWay = ref(PaymentWay.NORMAL);

/**
 * 获取支付类型
 * key 支付类型：支付金额
 * 每次进入时会初始化formData数据结构，这里不用担心数据类型不对
 */
const formData = ref<PaymentInputType>({} as unknown as PaymentInputType);
const paymentOptions = ref<
  Record<string, MerchantPaymentMethodConfigModelAddPayField[]>
>({});
/** 获取所有的支付方式 */
const getPaymentMethods = async () => {
  const res = await getOrderPaymentMethodConfigListApi({
    payment_scene_type: 'RETAIL_SALES',
  });
  const data = res?.data || [];
  if (res?.data) {
    const newData = data.map((item) => {
      return {
        ...item,
        field: {
          data: item.payment_method_mark!,
          params: item.payment_method_mark!,
          type: item.payment_method_type!,
          isActive: false,
        } as MerchantPaymentMethodConfigModelAddPayField,
      };
    });

    // data 按照payment_method_type分组
    const group = newData.reduce(
      (acc, cur) => {
        if (!cur.payment_method_type) return acc;
        if (!acc[cur.payment_method_type]) {
          acc[cur.payment_method_type] = [];
        }
        acc[cur.payment_method_type].push(cur);
        return acc;
      },
      {} as Record<string, MerchantPaymentMethodConfigModelAddPayField[]>,
    );

    for (const key in group) {
      if (group[key].length > 0) {
        if (group[key][0].field) {
          group[key][0].field.isActive = true;
        }
        formData.value[key] = {
          activeItemType: group[key][0].payment_method_type,
          activeItemMark: group[key][0].payment_method_mark,
          activeItemName: group[key][0].payment_method_name,
          activeItemAmount: undefined,
        };
      }
    }

    paymentOptions.value = group;
  }
};

/** 获取支付方式名称 */
function getPayMetName(list: MerchantPaymentMethodConfigModelAddPayField[]) {
  let name: string = '';
  list.forEach((item) => {
    if (item.field?.isActive) {
      name = item.payment_method_name!;
    }
  });
  return name;
}

/** 计算支付输入框的最大值 */
// 监听formData中余额支付的变化
watch(
  () => [formData, wipedAmount], // .BALANCE?.activeItemAmount,
  () => {
    // 计算余额支付的最大限制
    const maxBalance = Decimal(totalAmount.value || 0).minus(
      wipedAmount.value || 0,
    );
    // 总金额小于0 所有值都清空
    if (maxBalance.lte(0)) {
      for (const key in paymentOptions.value) {
        if (formData.value[key]?.activeItemAmount) {
          formData.value[key].activeItemAmount = '';
        }
      }
      return;
    }
    // 当前输入的值
    let currentInputNum = Decimal(0);
    try {
      // 当前输入的不是数字，直接置为 0
      currentInputNum = Decimal(
        formData.value[activeInputKey.value]?.activeItemAmount || 0,
      );
      // 如果当前输入框是抹零输入框，则使用wipedAmount的值
      if (activeInputKey.value === WIPED_AMOUNT_INPUT_KEY) {
        currentInputNum = Decimal(wipedAmount.value || 0);
      }
    } catch {
      currentInputNum = Decimal(0);
      if (activeInputKey.value === WIPED_AMOUNT_INPUT_KEY) {
        wipedAmount.value = 0;
      } else {
        formData.value[activeInputKey.value].activeItemAmount = '';
      }
    }

    // 当前输入框没有值，不处理
    if (
      activeInputKey.value !== WIPED_AMOUNT_INPUT_KEY &&
      currentInputNum.lte(0)
    )
      return;

    // 如果当前输入的值是余额，那么余额的值不能大于客户的余额总金额
    if (activeInputKey.value === PaymentMethodEnum.BALANCE) {
      const customerBalance = Decimal(customer.value?.balance || 0);
      if (
        formData.value[PaymentMethodEnum.BALANCE].activeItemAmount &&
        formData.value[PaymentMethodEnum.BALANCE].activeItemAmount > 0 &&
        customerBalance.lt(
          formData.value[PaymentMethodEnum.BALANCE].activeItemAmount || 0,
        )
      ) {
        formData.value[PaymentMethodEnum.BALANCE].activeItemAmount =
          customerBalance.toString();
      }
    }

    // 如果是现金，当前现金金额大于应付金额，清空其他金额的值
    if (
      Decimal(formData.value[PaymentMethodEnum.CASH].activeItemAmount || 0).gte(
        maxBalance,
      )
    ) {
      for (const key in paymentOptions.value) {
        if (
          key !== PaymentMethodEnum.CASH &&
          formData.value[key]?.activeItemAmount
        ) {
          formData.value[key].activeItemAmount = '';
        }
      }
      return;
    }

    // 如果当前是抹零，非现金收入小于应收，不处理
    let notCashPaymentAmount = Decimal(0);
    for (const key in paymentOptions.value) {
      if (
        key !== PaymentMethodEnum.CASH &&
        formData.value[key]?.activeItemAmount &&
        +formData.value[key].activeItemAmount > 0
      ) {
        notCashPaymentAmount = notCashPaymentAmount.add(
          formData.value[key].activeItemAmount,
        );
      }
    }
    if (notCashPaymentAmount.lt(maxBalance)) {
      return;
    }

    // 非现金输入框的值不能大于最大付款值
    if (activeInputKey.value !== PaymentMethodEnum.CASH) {
      // 非当前输入框的输入总额
      let otherPaymentAmount = Decimal(0);
      for (const key in paymentOptions.value) {
        if (
          key !== activeInputKey.value &&
          formData.value[key].activeItemAmount
        ) {
          otherPaymentAmount = otherPaymentAmount.add(
            formData.value[key].activeItemAmount || 0,
          );
        }
      }

      // 计算当前输入框的最大值
      const currentMax = maxBalance.minus(otherPaymentAmount);

      // 剩余值。可能小于0
      let currentLastValue = currentMax;
      if (currentLastValue.lte(0)) {
        // 剩余值小于0 ，当前输入框的值不是抹零，直接清空当前值
        if (activeInputKey.value === WIPED_AMOUNT_INPUT_KEY) {
          // 调整抹零后重新计算输入框的值
          for (const key in paymentOptions.value) {
            if (
              key !== activeInputKey.value &&
              formData.value[key].activeItemAmount
            ) {
              // 剩余金额是否大于0
              currentLastValue = Decimal(
                formData.value[key].activeItemAmount || 0,
              ).add(currentLastValue);
              const isLastLt0 = currentLastValue.lt(0);
              // 当前值不够减，继续执行
              if (isLastLt0) {
                formData.value[key].activeItemAmount = '';
              } else {
                formData.value[key].activeItemAmount =
                  currentLastValue.toNumber();
                break;
              }
            }
          }
        } else {
          formData.value[activeInputKey.value].activeItemAmount = 0;
        }
      } else {
        // 剩余可输入的金额大于0
        // 如果当前输入框不是抹零，算当前输入框的值
        if (
          activeInputKey.value !== WIPED_AMOUNT_INPUT_KEY &&
          currentInputNum.gt(currentMax)
        ) {
          formData.value[
            activeInputKey.value as PaymentMethodEnum
          ].activeItemAmount = currentMax;
        }
      }
    }
    // 一定要上面计算完下面再处理， 上面是通用逻辑，下面是针对赊账的特殊逻辑
    // 如果是赊账，总金额不能大于赊账金额
    if (paymentWay.value === PaymentWay.CREDIT) {
      //   // 非当前输入框的输入总额 nocashAmount
      // 现金总额
      let cashAmount = Decimal(0);
      if (+formData.value[PaymentMethodEnum.CASH]?.activeItemAmount > 0) {
        cashAmount = Decimal(
          formData.value[PaymentMethodEnum.CASH].activeItemAmount,
        );
      }
      // 现金最大值
      const maxCashAmount = maxBalance.minus(notCashPaymentAmount);
      if (cashAmount.gt(0) && cashAmount.gt(maxCashAmount)) {
        formData.value[PaymentMethodEnum.CASH].activeItemAmount =
          maxCashAmount.toString();
      }
    }
  },
  { immediate: false, deep: true },
);

/** 切换支付方式 */
async function handleChangePayMet(
  list: MerchantPaymentMethodConfigModelAddPayField[],
  id: string,
) {
  let item = {
    payment_method_type: '',
    payment_method_mark: '',
    payment_method_name: '',
    id: '',
  };
  list.forEach((payItem) => {
    if (payItem.id === id) {
      payItem.field.isActive = true;
      item = payItem;
    } else {
      payItem.field.isActive = false;
    }
  });
  if (item.id) {
    formData.value[item.payment_method_type].activeItemType =
      item.payment_method_type;
    formData.value[item.payment_method_type].activeItemMark =
      item.payment_method_mark;
    formData.value[item.payment_method_type].activeItemName =
      item.payment_method_name;
  }
}

/**
 * 一旦有2个输入框有值,则禁用其他输入框
 * 如果当前总金额大于应付金额，禁用其他输入框
 */
const payMethodDisable = computed(() => {
  // 余额是否禁用
  let balanceDisable = false;
  // 如果客户余额小于0，禁用
  if (!customer.value?.balance || customer.value?.balance < 0) {
    balanceDisable = true;
  }

  // 计算余额支付的最大限制
  const maxBalance = Decimal(orderDetail.value.total_amount || 0).minus(
    wipedAmount.value || 0,
  );
  let currentPayAmount = Decimal(0);

  //  支付方式已经有两种有值的话,除了当前两个外禁用
  let count = 0;
  // 不禁用的支付方式
  const DoNotDisableItem: PaymentMethodEnum[] = [];
  for (const key in paymentOptions.value) {
    if (
      formData.value[key].activeItemAmount &&
      +formData.value[key].activeItemAmount > 0
    ) {
      currentPayAmount = currentPayAmount.add(
        formData.value[key].activeItemAmount,
      );
      count++;
      DoNotDisableItem.push(key as PaymentMethodEnum);
    }
  }
  return {
    /** 当前是否禁用 */
    isDisable: count >= 2 || currentPayAmount.gte(maxBalance),
    /** 不禁用的支付方式 */
    DoNotDisableItem,
    /** 余额是否禁用 */
    balanceDisable,
  };
});

/** 获取选中支付方式的父级 */
function getPayMetParent(list: MerchantPaymentMethodConfigModelAddPayField[]) {
  let parent: PaymentMethodEnum | undefined;
  list.forEach((item) => {
    if (item.field.isActive) {
      parent = item.payment_method_type! as PaymentMethodEnum;
    }
  });
  return parent;
}

//  Map 存储支付方式和对应的金额
const paymentAmounts = ref(new Map<PaymentMethodEnum, number | string>());

// 获取选中的支付方式
const selectedPayments = computed(() => [...paymentAmounts.value.keys()]);

/** 计算实收金额 */
const tenderedAmount = computed(() => {
  let total = 0;
  for (const key in paymentOptions.value) {
    total += Number(formData.value[key].activeItemAmount)
      ? Number(formData.value[key].activeItemAmount)
      : 0;
  }
  return total;
});
/** 结算按钮禁用逻辑 */
const isSettlementDisabled = computed(() => {
  return Decimal(tenderedAmount.value || 0).lt(
    Decimal(totalAmount.value || 0).minus(wipedAmount.value || 0),
  );
});

// 计算总金额：total_Amount
const totalAmount = computed(() => {
  const amount = calculateOrderList.value?.total_amount || 0;
  return Number(amount).toFixed(2);
});

// 计算找零 找零 = 应收 -（总价 - 抹零） ： tenderedAmount - (total_Amount - wipedAmount)
const changeAmount = computed(() => {
  const totalAfterWipe = Decimal(totalAmount.value || 0).minus(
    wipedAmount.value || 0,
  );
  return Math.max(
    Decimal(tenderedAmount.value || 0)
      .minus(totalAfterWipe)
      .toNumber(),
    0,
  ).toFixed(2);
});

provide('settlementData', settlementData);

/** 恢复默认值,清空所有数据 TODO 移除不用的字段 */
const resetSettle = () => {
  balance.value = '';
  paymentWay.value = PaymentWay.NORMAL;
  wipedAmount.value = 0;
  // 清空支付金额Map
  paymentAmounts.value.clear();
  isPrintEnabled.value = false;
  isSettlementCompleted.value = false;
};

/** * cash input focus fn */
const focusCashInput = () => {
  setTimeout(() => {
    if (
      paymentInput.value &&
      paymentInput.value[PaymentMethodEnum.CASH] &&
      paymentInput.value[PaymentMethodEnum.CASH].$el
    ) {
      paymentInput.value[PaymentMethodEnum.CASH].$el
        .querySelector('input')
        ?.focus();
      paymentInput.value[PaymentMethodEnum.CASH].$el
        .querySelector('input')
        ?.select();
    } else {
      setTimeout(() => {
        focusCashInput();
      }, 200); // 如果没有找到，尝试再次聚焦
    }
  }, 200);
};

/** 设置支付金额 ，不处理金额值，最好不要直接使用 */
const setPaymentAmount = (method: PaymentMethodEnum, cleanValue: string) => {
  // 更新输入框的值
  formData.value[method].activeItemAmount = cleanValue;

  // 将输入值转换为数字
  const numValue = Number.parseFloat(cleanValue) || 0;
  // 更新支付金额映射
  if (numValue > 0) {
    paymentAmounts.value.set(method, numValue);
  } else {
    paymentAmounts.value.delete(method);
  }
};

// 处理支付方式变更
const handlePaymentChange = (method: PaymentMethodEnum, value: string) => {
  if (!value || +value === 0) {
    return setPaymentAmount(method, value);
  }

  // 清理输入值，只允许数字和小数点
  let cleanValue = value.replaceAll(/[^\d.]/g, '');

  // 确保只有一个小数点
  const dotIndex = cleanValue.indexOf('.');
  if (dotIndex !== -1) {
    const integerPart = cleanValue.slice(0, dotIndex + 1);
    const decimalPart = cleanValue.slice(dotIndex + 1).replaceAll('.', '');
    cleanValue = integerPart + decimalPart;
  }

  // 限制小数位数为2位
  if (cleanValue.includes('.')) {
    const parts = cleanValue.split('.');
    parts[1] = parts[1].slice(0, 2);
    cleanValue = parts.join('.');
  }
  setPaymentAmount(method, cleanValue);
};

// ======================== 打印计算相关 =======================
const orderDetail = computed<any>({
  set(value) {
    emit('update:detail', value);
  },
  get() {
    return detail.value;
  },
});

watchEffect(() => {
  orderDetail.value.round_down_amount = wipedAmount.value || 0;
  orderDetail.value.cash_change_amount = changeAmount.value;
  orderDetail.value.total_paid_amount = tenderedAmount.value;
  // 判断是否选择客户
  if (
    customer.value &&
    selectedPayments.value.includes(PaymentMethodEnum.BALANCE)
  ) {
    orderDetail.value.customer_detail_model.balance = subtractDecimal(
      customer.value.balance || 0,
      balance.value || 0,
    );
  }
});
// ======================== 打印计算相关 =======================

const currentSymbol = ref('');

/** 抽屉显示时，将现金设置成商品总价 */
watchEffect(() => {
  if (showDialog.value) {
    resetSettle();
    initializeCurrencySymbol()
      .then((symbol) => {
        currentSymbol.value = symbol;
        return getPaymentMethods();
      })
      .finally(() => {
        if (Decimal(totalAmount.value || 0).gt(0)) {
          handlePaymentChange(
            PaymentMethodEnum.CASH,
            String(totalAmount.value),
          );
          nextTick(() => {
            focusCashInput();
          });
        }
      });
  }
});

// 结算
const handleSettlement = async () => {
  // 1. 验证是否选择了支付方式
  if (selectedPayments.value.length === 0) {
    ElMessage.warning(t('sales.paymentMethodError'));
    return;
  }
  const other = {
    payment_method: [],
    payment_balance_amount: 0,
    cash_received_amount: 0,
    payment_card_amount: 0,
    payment_card_type: '',
    payment_third_party_amount: 0,
    payment_third_party_type: '',
  };
  for (const key in paymentOptions.value) {
    if (formData.value[key].activeItemAmount) {
      other.payment_method.push(formData.value[key].activeItemType);
    }
    switch (key) {
      case PaymentMethodEnum.BALANCE: {
        other.payment_balance_amount = formData.value[key].activeItemAmount
          ? formData.value[key].activeItemAmount
          : 0;
        break;
      }
      case PaymentMethodEnum.CARD: {
        other.payment_card_amount = formData.value[key].activeItemAmount
          ? formData.value[key].activeItemAmount
          : 0;
        if (formData.value[key].activeItemAmount) {
          other.payment_card_type = formData.value[key].activeItemMark;
        }
        break;
      }
      case PaymentMethodEnum.CASH: {
        other.cash_received_amount = formData.value[key].activeItemAmount
          ? formData.value[key].activeItemAmount
          : 0;
        break;
      }
      case PaymentMethodEnum.THIRD_PARTY: {
        other.payment_third_party_amount = formData.value[key].activeItemAmount
          ? formData.value[key].activeItemAmount
          : 0;
        if (formData.value[key].activeItemAmount) {
          other.payment_third_party_type = formData.value[key].activeItemMark;
        }
        break;
      }
    }
  }

  const cashAmount = subtractDecimal(
    other.cash_received_amount || 0,
    Number(changeAmount.value) || 0,
  );
  try {
    const params = {
      order_no: orderData.value.order_no || '',
      merchant_id: merchantId,
      ...other,
      total_paid_amount: orderData.value.total_amount - wipedAmount.value,
      round_down_amount: wipedAmount.value,
      payment_cash_amount: cashAmount,
      cash_change_amount: Number(changeAmount.value),
    };

    // 5. 验证混合支付规则
    if (paymentMethod.value && selectedPayments.value.length < 2) {
      ElMessage.error(t('sales.mixtPaymentError'));
      return;
    }

    const res = await offlinePayApi(params);

    if (String(res.code) === 'SUCCESS') {
      ElMessage.success(res.message);
      settlementData.value = params as never;
      emit('settlement-success', params);
      isPrintEnabled.value = true;
      isSettlementCompleted.value = true;
      emit('handleEmpty');

      emit('close-drawer');
    } else {
      ElMessage.error(res.message || t('sales.settlementError'));
    }
  } catch (error: any) {
    ElMessage.error(error.message || t('sales.settlementError'));
  }
};
async function handleSettleAccount() {
  const receiptOrderItemList = [];
  for (const key in paymentOptions.value) {
    if (formData.value[key].activeItemAmount) {
      const activeItem = paymentOptions.value[key].find(
        (item) =>
          item.activeItemMark === formData.value[key].payment_method_mark,
      );
      if (Object.keys(activeItem).length > 0) {
        receiptOrderItemList.push({
          account_id: activeItem.account_id,
          account_ledger_id: activeItem.account_ledger_id,
          amount: formData.value[key].activeItemAmount,
          business_id: activeItem.business_id,
          business_type: activeItem.business_type,
          external_transaction_no: activeItem.external_transaction_no,
          payment_method_mark: activeItem.payment_method_mark,
          payment_method_type: activeItem.payment_method_type,
          payment_method_name: activeItem.payment_method_name,
          receipt_order_id: activeItem.receipt_order_id,
          remark: activeItem.remark,
        });
      }
    }
  }
  // 已经支付的金额
  let total_amount = 0;
  receiptOrderItemList.forEach((item) => {
    total_amount = addDecimal(total_amount, item.amount);
  });

  // 赊账总金额
  const total_paid_amount =
    calculateOrderList.value.total_amount - wipedAmount.value;

  // 如果赊账金额小于等于total_amount，则不允许创建赊账订单
  if (total_paid_amount <= 0 || total_paid_amount <= total_amount) {
    return ElMessage.warning(
      t('sales.validate_payment_amount_credit_cannot_gte_amount'),
    );
  }

  // 创建代付
  try {
    const res = await createCreditApi({
      // currency_code: userStore.merchantInfo.basic_currency_code,
      payment_type: 'CREDIT',
      order_no: orderData.value.order_no,
      remaining_amount: calculateOrderList.value.total_amount, // 待还金额
      receivable_total_amount: total_amount,
      total_paid_amount,
      type: 'CREDIT_SALES',
      channel: 'WEB',
      receipt_order_item_list: receiptOrderItemList, // 支付创建列表 同客户列表一样
    });

    if (res?.code === 'SUCCESS') {
      const result = await getOrderDetailApi({
        order_no: orderData.value.order_no,
      });
      if (String(result.code) === 'SUCCESS') {
        ElMessage.success(result.message);
        // settlementData.value = params as never
        // emit('settlement-success', params)
        isPrintEnabled.value = true;
        isSettlementCompleted.value = true;
        emit('handleEmpty');
        emit('settlement-success', result);
        emit('close-drawer');
      } else {
        ElMessage.error(res.message || t('sales.settlementError'));
      }
    }
  } catch (error) {
    console.log('=============>handleSettleAccount', error);
  }
}

// 点击选中输入框
const handleWipeFocus = () => {
  activeInputKey.value = WIPED_AMOUNT_INPUT_KEY;
  const inputEl = wipedAmountInput.value?.$el?.querySelector('input');
  if (inputEl) {
    inputEl.select();
  }
};

defineExpose({
  isSettled,
});
</script>
<template>
  <div class="scan-cash-settlement">
    <!-- 总金额 -->
    <div
      class="mb-1 flex items-center justify-between bg-white pb-2.5 pl-5 pr-5 pt-2.5 text-2xl font-semibold"
    >
      <span class="scan-cash-settlement-header-title"
        >{{ t('sales.accounts_receivable') }}:</span
      >

      <span class="">{{ totalAmount }} {{ currentSymbol }}</span>
    </div>
    <!-- 实付金额 -->
    <div
      class="mb-1 flex items-center justify-between bg-white pb-2.5 pl-5 pr-5 pt-2.5 text-2xl font-semibold"
    >
      <span class="scan-cash-settlement-header-title"
        >{{ t('sales.amountTendered') }}:</span
      >

      <span class="scan-cash-settlement-header-amount"
        >{{ tenderedAmount.toFixed(2) }} {{ currentSymbol }}</span
      >
    </div>
    <!-- 抹零 -->
    <div
      class="mb-1 flex items-center justify-between gap-2.5 bg-white pb-2.5 pl-5 pr-5 pt-2.5 text-2xl font-semibold"
    >
      <span class="scan-cash-settlement-header-title"
        >{{ t('sales.amountChange') }}:</span
      >
      <div class="flex-1">
        <el-input-number
          ref="wipedAmountInput"
          v-model="wipedAmount"
          :controls="false"
          clearable
          class="w-full"
          :precision="2"
          :step="0.01"
          :max="totalAmount"
          controls-position="right"
          @focus="handleWipeFocus"
        >
          <template #suffix>
            <span>{{ currentSymbol }}</span>
          </template>
        </el-input-number>
      </div>
    </div>
    <!-- 支付方式 -->
    <div class="mb-1 bg-white pb-2.5 pl-5 pr-5 pt-2.5">
      <el-checkbox
        v-model="paymentWay"
        :true-value="PaymentWay.CREDIT"
        :false-value="PaymentWay.NORMAL"
        :disabled="
          !calculateOrderList.customer_id ||
          calculateOrderList.customer_id === '0'
        "
      >
        {{ t('set.on_credit') }}
      </el-checkbox>
      <ul>
        <li
          v-for="item in paymentOptions"
          :key="item"
          class="bg-primary-light-8 borde mb-2.5 flex items-center rounded-md text-sm"
        >
          <!-- 图标 -->
          <el-dropdown :disabled="item.length <= 1" class="h-full w-1/2">
            <div class="text-azure w-full pl-3 pr-3">
              <div class="flex min-w-[60%] items-center gap-2.5">
                <el-icon>
                  <Tickets />
                </el-icon>
                <p class="flex-1">{{ getPayMetName(item) }}</p>
                <el-icon v-if="item.length > 1">
                  <ArrowDown />
                </el-icon>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="bg-white">
                <el-dropdown-item
                  v-for="payItem in item"
                  :key="payItem.id"
                  @click="handleChangePayMet(item, payItem.id)"
                >
                  <div
                    class="hover:bg-primary-blue flex h-9 min-w-[112px] items-center pl-2 pr-2"
                  >
                    {{ payItem.payment_method_name || '' }}
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 支付方式 对应的 输入框 -->
          <ElInput
            :ref="(ref) => (paymentInput[item[0].payment_method_type!] = ref)"
            v-model="
              formData[item[0].payment_method_type as keyof typeof formData]
                .activeItemAmount
            "
            :disabled="
              (payMethodDisable.isDisable &&
                !payMethodDisable.DoNotDisableItem.includes(
                  getPayMetParent(item),
                )) ||
              (getPayMetParent(item) === PaymentMethodEnum.BALANCE &&
                payMethodDisable.balanceDisable)
            "
            clearable
            class="w-1/2"
            placeholder="0"
            @focus="() => (activeInputKey = item[0].payment_method_type)"
          />
        </li>
      </ul>
    </div>
    <!-- 找零 -->
    <div
      class="mb-1 flex items-center justify-between gap-2.5 bg-white pb-2.5 pl-5 pr-5 pt-2.5 text-2xl font-semibold"
    >
      <span class="text-status-partial">{{ t('sales.change') }}:</span>
      <span class="text-status-terminated"
        >{{ changeAmount }} {{ currentSymbol }}</span
      >
    </div>

    <div
      class="scan-cash-settlement-button absolute bottom-0 flex w-full justify-end bg-white pb-2.5 pr-5 pt-2.5"
    >
      <el-button
        v-printv1="printObj"
        :disabled="!isPrintEnabled"
        class="scan-cash-settlement-button-print"
      >
        {{ t('sales.print') }}
      </el-button>

      <el-button
        v-if="paymentWay === PaymentWay.CREDIT"
        v-printv1="printObj"
        @click="handleSettleAccount"
      >
        <span class="text-white"> {{ t('set.on_credit') }} </span>
      </el-button>
      <el-button
        v-else
        :disabled="isSettlementDisabled"
        :class="{ 'is-disabled': isSettlementDisabled }"
        @click="handleSettlement"
      >
        <span class="text-white">
          {{ t('sales.settlement') }}
        </span>
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use 'sass:map';

.scan-cash-settlement {
  position: relative;
  height: 96%;
  margin: 20px 16px 10px;

  &-button {
    &-print,
    &-open {
      &:disabled {
        color: #9e9e9e;
        cursor: not-allowed;
        background: #f5f7fa;
      }
    }

    :deep(.el-button) {
      height: 40px;
    }

    &-print {
      color: #0d9eff;
      background: #9e9e9e;
    }

    &-settlement {
      color: #fff;
      background: #f56c6c;

      &.is-disabled {
        color: #fff;
        cursor: not-allowed;
        background: #c0c4cc; // 灰色背景
      }
    }
  }
}
</style>
