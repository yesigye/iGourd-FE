<script setup lang="ts">
import { computed, reactive, ref, toRefs, watch } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElIcon,
  ElInput,
  ElMessage,
  ElMessageBox,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  getCustomTemplateListApi,
  orderRefundOffline,
  orderReturnedDetails,
  refundableAmount,
} from '@@/sale/apis';

import {
  ReceiptTemplate,
  useReceiptTemplate,
} from '#/components/receipt-template'; // 生成小票模板
import { initializeCurrencySymbol } from '#/utils/sale';

const emit = defineEmits([
  'close-tkr',
  'handleEmpty',
  'handleEmptyAmount',
  'paySuccess',
]);

const printObj = {
  ids: '#receiptPrintId5',
  popTitle: '页面打印',
};
const { t } = useI18n();
const createReturedInfo = ref({});
const compuredReturnedinfo = ref({});
const stillBalance = computed(() => {
  const totalAmt =
    refundableAmountData.value?.remaining_amount -
    compuredReturnedinfo.value?.total_amount;

  return Math.max(totalAmt, 0);
});
const actualRefundAmount = computed(() => {
  const totalAmt =
    compuredReturnedinfo.value?.total_paid_amount -
    refundableAmountData.value?.remaining_amount;
  return Math.max(totalAmt, 0);
});
const balanceDeduction = computed(() => {
  return Math.min(
    compuredReturnedinfo.value?.total_amount,
    refundableAmountData.value?.remaining_amount,
  );
});
const state = reactive({
  loading: false,
  unitFrom: {
    name: '',
  },

  roleList: [] as any[],
  countriesList: [] as any[],
  currentSymbol: '',
  orderInfo: {} as any,
  orderItemModelList: [] as any[],
  receiptTemplates: {} as any,
  column_option_list: [] as any,
  settlementInfo: {} as any,

  printTemplate: {} as any,
});
const { currentSymbol, printTemplate } = toRefs(state);

const { receiptRoles, setOrderDetail } = useReceiptTemplate({
  title: 'print-temp.refund',
  printTemplate,
  fieldColumns: [
    { column_option_code: 'refund_total_amount', is_selected: true },
    { column_option_code: 'order_returned_no', is_selected: true },
  ],
  callbackBefore: {
    quantity: renderQuantUnit,
    total_quantity: renderQuantUnit,
    refund_total_amount: () => '-',
  },
});
const printParams = {
  id: 'receiptPrintId5',
};
const newOrderDetails = ref({});
const getReturnedDetail = async () => {
  const res = await orderReturnedDetails({
    order_returned_no: createReturedInfo.value?.order_returned_no,
  });
  newOrderDetails.value = res;
  createReturedInfo.value = res;
  newOrderDetails.value.order_item_model_list =
    res.order_returned_item_model_list;
};
watch(
  () => [compuredReturnedinfo.value, createReturedInfo.value],
  ([newOrderDetail, refundInfo]) => {
    if (newOrderDetail) {
      const { order_item_model_list, order_no, ...other } =
        createReturedInfo.value;
      const total_amount = Math.abs(newOrderDetail.total_amount);
      // 计算总数量
      if (newOrderDetails.value.order_item_model_list?.length) {
        newOrderDetails.value.total_quantity =
          newOrderDetails.value.order_item_model_list.reduce(
            (prev: any, current: any) => {
              return prev + current.quantity;
            },
            0,
          );
      }

      setOrderDetail({
        ...other,
        total_amount,
        order_returned_no: refundInfo.order_returned_no,
        order_item_model_list: newOrderDetail.order_calc_product_model_list,
        refund_total_amount: total_amount,
      });
    }
  },
  {
    deep: true,
  },
);
function renderQuantUnit() {
  return 'x';
}
const settlementParams = ref({
  order_returned_no: '', // 退款单号
  payment_balance_amount: 0, // 余额
  payment_card_amount: 0, // 卡支付
  payment_card_type: 'CREDIT_CARD', // 卡类型
  payment_cash_amount: 0, // 现金支付
  payment_method: [], // 支付方式
  payment_third_party_amount: 0, // 第三方支付
  payment_third_party_type: 'ALIPAY', // 第三方支付类型
  payment_third_party_ids: [], // 第三方支付ids
  payment_card_type_ids: [], // 银行卡类型ids
  refund_method_amount: {}, // 退款方式于退款金额
  remaining_amount: 0, // 剩余欠款
  sale_discount_amount: 0, // 销售折扣金额
  total_paid_amount: 0, // 实际退款金额
  refund_difference_amount: 0, // 退款差异金额
  debt_deduction_amount: 0, // 欠款抵扣金额
});
const isRefundSuccess = ref(false);

const checkPaymentMethod = (name) => {
  ElMessageBox.confirm(
    t('common.payment-method-delisting-reminder', {
      pay_name: name,
    }),
    t('common.prompt-message'),
    {
      confirmButtonText: t('common.confirm-btn'),
      showCancelButton: false,
      type: 'warning',
    },
  );
};
const handleRefundOrder = async () => {
  settlementParams.value.refund_method_amount = {};
  settlementParams.value.order_returned_no =
    createReturedInfo.value.order_returned_no;
  /** 银行卡ids*/
  const bankCardIds = [];
  /** 三方支付ids*/
  const thirdPartyPaymentIds = [];
  let cashAmount = 0;
  let cardAmount = 0;
  let thirdPartyAmount = 0;
  let balanceAmount = 0;
  if (refundableAmountData.value?.refund_method_amount.length > 0) {
    settlementParams.value.payment_method = [];
    refundableAmountData.value.refund_method_amount.forEach((item: any) => {
      settlementParams.value.refund_method_amount[item.refund_method_mark] =
        item.refund_amount;
      // 数组去重
      if (
        !settlementParams.value.payment_method.indexOf(
          item.refund_method_type,
        ) === -1
      ) {
        settlementParams.value.payment_method.push(item.refund_method_type);
      }

      if (item.refund_method_type === 'CASH') {
        cashAmount += item.refund_amount;
      }
      if (item.refund_method_type === 'BALANCE') {
        balanceAmount += item.refund_amount;
      }
      if (item.refund_method_type === 'THIRD_PARTY') {
        thirdPartyPaymentIds.push(item.refund_method_id);
        thirdPartyAmount += item.refund_amount;
      }
      if (item.refund_method_type === 'CARD') {
        bankCardIds.push(item.refund_method_id);
        cardAmount += item.refund_amount;
      }
    });
  }
  settlementParams.value.payment_cash_amount = cashAmount;
  settlementParams.value.payment_card_amount = cardAmount;
  settlementParams.value.payment_third_party_amount = thirdPartyAmount;
  settlementParams.value.payment_balance_amount = balanceAmount;
  settlementParams.value.payment_card_type_ids = bankCardIds;
  settlementParams.value.payment_third_party_ids = thirdPartyPaymentIds;
  // 退款方式于退款方式
  // let RefundMethodAndAmountRecord = {}
  settlementParams.value.refund_method_amount = JSON.stringify(
    settlementParams.value.refund_method_amount,
  );

  settlementParams.value.remaining_amount = stillBalance.value;
  settlementParams.value.total_paid_amount = actualRefundAmount.value;
  settlementParams.value.sale_discount_amount =
    compuredReturnedinfo.value.vip_discount_amount +
    compuredReturnedinfo.value.promotion_discount_amount;
  settlementParams.value.round_down_amount =
    compuredReturnedinfo.value.round_down_amount;
  settlementParams.value.debt_deduction_amount =
    compuredReturnedinfo.value.debt_deduction_amount;
  settlementParams.value.refund_difference_amount =
    compuredReturnedinfo.value.promotion_discount_amount +
    compuredReturnedinfo.value.round_down_amount +
    compuredReturnedinfo.value.debt_deduction_amount +
    compuredReturnedinfo.value.vip_discount_amount;
  // settlementParams.value.cash_change_amount = parseFloat(changeAmount.value);
  try {
    const res = await orderRefundOffline(settlementParams.value);
    isRefundSuccess.value = true;
    emit('close-tkr');
    emit('handleEmpty');
    emit('handleEmptyAmount');
    emit('paySuccess');
  } catch (error: any) {
    if (error.code === 'PAYMENT_METHOD_IS_DISABLED') {
      checkPaymentMethod(error.message);
    } else {
      ElMessage.error(error);
      console.log(error);
    }
  }
};
const getTemplateList = async (type: string) => {
  const params = {
    type,
    is_default: true,
  };
  const res = await getCustomTemplateListApi(params);
  if (type === 'REFUND_RECEIPT') {
    const data = res || [];
    const templateList = data.find((item) => item.is_default) || {};
    if (templateList) {
      // templateList.column_option_list = templateList.column_option_list.filter(
      //   item => item.column_option_code !== 'order_no'
      // );
      printTemplate.value = templateList;
    }
  }
};
const refundableAmountData = ref({});
const getRefundableAmountData = async () => {
  const res = await refundableAmount({
    order_returned_no: createReturedInfo.value.order_returned_no,
  });
  refundableAmountData.value = res;
};
async function initMounted() {
  currentSymbol.value = await initializeCurrencySymbol();
  getTemplateList('REFUND_RECEIPT');
}

const [Drawer, drawerApi] = useIgourdDrawer({
  onOpenChange: (val) => {
    if (val) {
      const data = drawerApi.getData();
      Promise.all([
        (createReturedInfo.value = data.createReturnedInfo),
        (compuredReturnedinfo.value = data.compuredReturnedinfo),
      ]).then(() => {
        isRefundSuccess.value = false;
        getReturnedDetail();
        getRefundableAmountData();
        initMounted();
      });
    }
  },
});
</script>
<template>
  <Drawer>
    <section class="flex h-full gap-2">
      <div class="w-1/3 overflow-auto pr-2" style="height: calc(100vh - 88px)">
        <ReceiptTemplate
          :print-id="printParams.id"
          :option-content="printTemplate.option_content"
          :image-url="printTemplate.profile_photo"
          :print-info="[{ ...newOrderDetails, Template: { ...printTemplate } }]"
          :roles="receiptRoles"
          template-type="REFUND_RECEIPT"
        />
      </div>
      <div class="bg-bg relative w-2/3">
        <div v-if="!isRefundSuccess" class="refunded-data ml-1">
          <div class="bg-white p-2.5">
            <div
              class="border-border-disabled flex items-center gap-1 border-b border-solid pl-1"
            >
              <span class="bg-primary block h-2.5 w-1 rounded"></span>
              <span>{{ t('returned.sales-order-information') }}</span>
            </div>
            <div class="mt-2.5">
              <ElDescriptions
                class="margin-top"
                label-width="140px"
                :column="3"
                border
              >
                <ElDescriptionsItem>
                  <template #label>
                    <div class="cell-item">
                      {{ t('returned.sales-total') }} ({{ currentSymbol }})
                    </div>
                  </template>
                  {{ refundableAmountData?.order_total_amount || '0' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem>
                  <template #label>
                    <div class="cell-item">
                      {{ t('returned.balance-debt') }} ({{ currentSymbol }})
                    </div>
                  </template>
                  {{ refundableAmountData?.remaining_amount || '0' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem>
                  <template #label>
                    <div class="cell-item">
                      {{ t('returned.refunded') }}({{ currentSymbol }})
                    </div>
                  </template>
                  {{ refundableAmountData?.refund_total_amount || '0' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem>
                  <template #label>
                    <div class="cell-item">
                      {{ t('returned.tendered-amount') }} ({{ currentSymbol }})
                    </div>
                  </template>
                  <div class="font-bold">
                    <p
                      v-for="(
                        value, key
                      ) in refundableAmountData?.order_payment_amount_transaction_map"
                      :key="key"
                    >
                      {{ key }} --
                      {{ value }}
                    </p>
                  </div>
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
          </div>
          <div class="mt-1 bg-white p-2.5">
            <div
              class="border-border-disabled flex items-center gap-1 border-b border-solid pl-1"
            >
              <span class="bg-primary block h-2.5 w-1 rounded"></span>
              <span>{{ t('returned.refund-information') }}</span>
            </div>
            <div class="mt-2.5">
              <ElDescriptions
                class="margin-top"
                :column="3"
                label-width="140px"
                border
              >
                <ElDescriptionsItem :span="1">
                  <template #label>
                    <div class="cell-item">
                      {{ t('returned.refundable-value') }}
                    </div>
                  </template>
                  {{ refundableAmountData?.returnable_value || '--' }}
                </ElDescriptionsItem>
                <ElDescriptionsItem :span="2">
                  <template #label>
                    <div class="cell-item">
                      {{ t('returned.returnable-amount') }}
                    </div>
                  </template>
                  <p class="text-error">
                    {{ refundableAmountData?.returnable_amount || '--' }}
                  </p>
                </ElDescriptionsItem>
              </ElDescriptions>
            </div>
          </div>
          <div class="mt-1 flex gap-1">
            <div
              class="flex h-[52px] w-full items-center justify-between bg-white pl-5 pr-5"
            >
              <span class="font-700 text-sm">{{
                t('returned.this-refund')
              }}</span>

              <span class="text-status-blocked text-2xl">{{
                compuredReturnedinfo?.total_amount || '--'
              }}</span>
            </div>
            <div
              class="flex h-[52px] w-full items-center justify-between bg-white pl-5 pr-5"
            >
              <span class="font-700 text-sm">{{
                t('returned.still-balance')
              }}</span>

              <span class="text-status-blocked text-2xl">{{
                stillBalance
              }}</span>
            </div>
          </div>
          <div
            class="font-700 mt-1 flex h-[52px] w-full items-center justify-between bg-white pl-5 pr-5"
          >
            <span class="text-status-partial">{{
              t('returned.actual-refund')
            }}</span>

            <span class="text-status-blocked text-2xl">{{
              actualRefundAmount
            }}</span>
          </div>
          <div class="mt-1 bg-white pb-1.5 pl-5 pr-5 pt-1.5">
            <p class="text-xs">
              {{ t('returned.source-of-payment-discount') }}：
            </p>
            <p class="font-700 mt-2.5 flex flex-wrap gap-7 text-sm">
              <span
                >{{ t('returned.sales-wipe') }}：{{
                  createReturedInfo?.round_down_amount || '0'
                }}</span
              ><span
                >{{ t('returned.sales-discount') }}：{{
                  createReturedInfo?.promotion_discount_amount || '0'
                }}</span
              ><span
                >{{ t('returned.balance-deduction') }}：{{
                  balanceDeduction
                }}</span
              >
            </p>
          </div>
          <div
            v-if="refundableAmountData.refund_method_amount?.length > 0"
            class="mt-1 flex flex-wrap gap-2.5 bg-white pb-2.5 pl-5 pr-5 pt-2.5"
          >
            <!-- 支付方式 -->
            <div
              v-for="item in refundableAmountData.refund_method_amount"
              :key="item.refund_method_id || item.refund_method_mark"
              class="payment-item"
            >
              <div
                class="border-border-disabled flex items-center gap-5 border-b border-solid pb-2"
              >
                <div class="payment-item-name">
                  <span class="font-bold">{{ item.refund_method_name }}</span>
                </div>
                <div class="payment-item-line bg-border-disabled"></div>
                <div class="payment-item-amount">
                  <ElInput
                    v-model="item.refund_amount"
                    type="number"
                    :max="item.refund_amount"
                    :disabled="true"
                    :border="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="isRefundSuccess"
          class="full refunded-data-success flex w-full items-center justify-center bg-white"
        >
          <div class="text-center">
            <ElIcon size="64px">
              <SuccessFilled />
            </ElIcon>

            <p class="mt-2.5 text-center text-sm">
              {{ t('returned.refund-success') }}
            </p>
          </div>
        </div>
        <div class="refund-option absolute bottom-0 left-0 w-full">
          <div class="flex h-16 items-center justify-end bg-white">
            <ElButton
              v-print="printObj"
              class="border-primary h-11 border border-solid"
            >
              <span class="text-primary">{{ t('common.print-receipt') }}</span>
            </ElButton>
            <ElButton
              v-if="!isRefundSuccess"
              class="h-11"
              @click="handleRefundOrder"
              type="danger"
            >
              <span>{{ t('common.refund') }}</span>
            </ElButton>
          </div>
        </div>
      </div>
    </section>
  </Drawer>
</template>
