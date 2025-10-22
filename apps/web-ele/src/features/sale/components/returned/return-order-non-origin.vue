<script setup lang="ts">
import { reactive, ref, toRefs, watch } from 'vue';

import {
  ElButton,
  ElIcon,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElScrollbar,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  getCustomTemplateListApi,
  getOrderPaymentMethodConfigListApi,
  orderReturnedDetails,
  refundOrderNonOriginApi,
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
const createReturedInfo = ref<{
  order_returned_no: string;
  remaining_amount: number;
  total_amount: number;
  total_paid_amount: number;
}>({}) as any;
const compuredReturnedinfo = ref({});
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
const currentPayItem = ref({});
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
const paymentOptions = ref([] as any[]);
const getPaymentMethods = async () => {
  const data = await getOrderPaymentMethodConfigListApi({
    payment_scene_type: 'RETAIL_SALES',
    is_filter_balance: true,
  });

  if (data) {
    const newData = data.map((item) => {
      return {
        ...item,
      };
    });
    paymentOptions.value = newData;
  }
};
const getReturnedDetail = async () => {
  const res = await orderReturnedDetails({
    order_returned_no: createReturedInfo.value?.order_returned_no,
  });
  newOrderDetails.value = res;
  createReturedInfo.value = res;
  newOrderDetails.value.order_item_model_list =
    res.order_returned_item_model_list;
};
// 已选择的支付方式
const refundPayMethod = ref([] as any[]);
const handSelectPayMenthod = (item: any) => {
  const index = refundPayMethod.value.findIndex((payItem) => {
    return payItem.id == item.id;
  });
  if (index === -1) {
    if (refundPayMethod.value.length >= 2) {
      return false;
    }
    item.refund_amount = '';
    refundPayMethod.value.push(item);
  } else {
    refundPayMethod.value.splice(index, 1);
  }
};
/** 获取支付方式*/
const isActivePayMentond = (item: any) => {
  return refundPayMethod.value.some((i: any) => i.id === item.id);
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
const handlePayItem = (item: any) => {
  currentPayItem.value = item;
};
/** 输入限制
 * 限制:
 * 1、不得小于0
 * 2、其他支付方式相加不得超过订单总和
 */
watch(
  () => currentPayItem.value,
  (val) => {
    if (val === '-') {
      currentPayItem.value.refund_amount = 0;
      return;
    }

    // 限制1：不得小于0
    if (Number(val.refund_amount) < 0) {
      currentPayItem.value.refund_amount = 0;
      ElMessage.warning(t('returned.amount-cannot-be-less-than-zero'));
      return;
    }

    // 限制2：其他支付方式相加不得超过订单总和
    const totalAmount = Math.abs(compuredReturnedinfo.value.total_amount);
    let currentTotal = 0;

    refundPayMethod.value.forEach((item) => {
      currentTotal += Number(item.refund_amount || 0);
    });

    if (currentTotal > totalAmount) {
      // 超出订单总额，将当前输入值调整为允许的最大值
      const otherTotal =
        currentTotal - Number(currentPayItem.value.refund_amount);
      const maxAllowed = Math.max(0, totalAmount - otherTotal);
      currentPayItem.value.refund_amount = maxAllowed.toString();

      ElMessage.warning(t('returned.amount-entered-must-not-exceed'));
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
function renderQuantUnit() {
  return 'x';
}
const isRefundSuccess = ref(false);

const checkPaymentMethod = (name) => {
  ElMessageBox.confirm(
    t('common.payment-method-delisting-reminder', {
      pay_name: name,
    }),
    t('common.prompt-message'),
    {
      confirmButtonText: t('common.confirm'),
      showCancelButton: false,
      type: 'warning',
    },
  );
};
const handleRefundOrder = async () => {
  /** 现金金额*/
  let cashAmount = 0;
  /** 支付方式*/
  const payment_method = [] as string[];
  /** 余额*/
  let payment_balance_amount = 0;
  /** 银行卡*/
  let payment_card_amount = 0;
  /** 退款方式于退款金额*/
  let refund_method_amount = '';
  // 第三方支付金额
  let payment_third_party_amount = 0;
  // 银行卡类型ids
  const payment_card_type_ids = [] as string[];
  const payment_third_party_ids = [] as string[];
  const payment_card_type_marks = [] as string[];
  const payment_third_party_marks = [] as string[];
  const sale_discount_amount = 0;
  const refund_difference_amount = 0;
  const refund_method_amount_list = {} as Record<string, number>;
  refundPayMethod.value.forEach((item) => {
    if (Number(item.refund_amount) > 0) {
      refund_method_amount_list[item.payment_method_mark] = item.refund_amount;
      payment_method.push(item.payment_method_type);
      if (item.payment_method_type === 'CASH') {
        cashAmount += Number(item.refund_amount);
      }
      if (item.payment_method_type === 'BALANCE') {
        payment_balance_amount += Number(item.refund_amount);
      }
      if (item.payment_method_type === 'THIRD_PARTY') {
        payment_third_party_ids.push(item.payment_method_id);
        payment_third_party_marks.push(item.payment_method_mark);
        payment_third_party_amount += Number(item.refund_amount);
      }
      if (item.payment_method_type === 'CARD') {
        payment_card_type_ids.push(item.payment_method_id);
        payment_card_type_marks.push(item.payment_method_mark);
        payment_card_amount += Number(item.refund_amount);
      }
    }
  });
  refund_method_amount = JSON.stringify(refund_method_amount_list);
  // 新的非原单退款参数
  const refundParams = {
    order_returned_no: createReturedInfo.value.order_returned_no,
    payment_cash_amount: cashAmount,
    payment_method,
    payment_balance_amount,
    payment_card_amount,
    refund_method_amount,
    total_paid_amount: createReturedInfo.value.total_paid_amount,
    payment_third_party_amount,
    payment_card_type_ids,
    payment_third_party_ids,
    payment_card_type_marks,
    payment_third_party_marks,
    sale_discount_amount,
    refund_difference_amount,
  };
  try {
    const res = await refundOrderNonOriginApi(refundParams);
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
      console.error(error);
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
        getPaymentMethods();
        // getRefundableAmountData();
        initMounted();
      });
    }
  },
});
</script>
<template>
  <Drawer>
    <section class="flex h-full gap-2">
      <div class="w-1/3">
        <ElScrollbar>
          <ReceiptTemplate
            :print-id="printParams.id"
            :option-content="printTemplate.option_content"
            :image-url="printTemplate.profile_photo"
            :print-info="[
              { ...newOrderDetails, Template: { ...printTemplate } },
            ]"
            :roles="receiptRoles"
            template-type="REFUND_RECEIPT"
          />
        </ElScrollbar>
      </div>
      <div class="bg-bg relative w-2/3">
        <div v-if="!isRefundSuccess" class="refunded-data ml-1">
          <!-- 非原单支付方式选择 -->
          <ElScrollbar class="mt-2.5">
            <div class="flex gap-2.5" style="width: fit-content">
              <p
                v-for="item in paymentOptions"
                :key="item"
                class="border-primary flex-shrink-0 cursor-pointer border border-solid p-4"
                :class="
                  isActivePayMentond(item)
                    ? 'bg-primary text-white'
                    : 'bg-card text-primary'
                "
                @click="handSelectPayMenthod(item)"
              >
                {{ item.payment_method_name }}
              </p>
            </div>
          </ElScrollbar>
          <div class="mt-3 flex gap-1">
            <div
              class="flex flex-grow justify-between rounded-sm bg-gray-50 pb-4 pl-5 pr-5 pt-4"
            >
              <span class="text-bold">{{ t('returned.this-refund') }}</span>
              <span>{{ createReturedInfo?.total_amount }}</span>
            </div>
            <div
              class="flex flex-grow justify-between rounded-sm bg-gray-50 pb-4 pl-5 pr-5 pt-4"
            >
              <span class="text-bold">{{ t('returned.refund-discount') }}</span>
              <span>-{{ compuredReturnedinfo?.sale_discount_amount || 0 }}</span>
            </div>
          </div>
          <div
            class="mt-1 flex justify-between rounded-sm bg-gray-50 pb-4 pl-5 pr-5 pt-4"
          >
            <span class="text-bold text-[#FF9800]">{{
              t('returned.actual-refund')
            }}</span>
            <span>{{ createReturedInfo?.total_paid_amount || 0 }}</span>
          </div>
          <div
            v-if="refundPayMethod.length > 0"
            class="mt-1 flex flex-wrap gap-1 bg-gray-50 pb-2.5 pl-5 pr-5 pt-2.5"
          >
            <div
              class="pay-item border-primary flex gap-5 border-b border-solid pb-1.5 pt-1.5"
              v-for="item in refundPayMethod"
              :key="item.id"
            >
              <div class="flex-grow">{{ item.payment_method_name }}</div>
              <div class="bg-primary h-6 w-[2px]"></div>
              <div class="w-[40%] flex-grow">
                <ElInput
                  v-model="item.refund_amount"
                  style="box-shadow: none"
                  :clearable="true"
                  type="number"
                  :min="0"
                  @input="handleInput"
                  @focus="handlePayItem(item)"
                  @click="handlePayItem(item)"
                />
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
              {{ $t('returned.refund-success') }}
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
<style scoped>
.scrollbar-flex-content {
  display: flex;
  width: fit-content;
}

.pay-item {
  width: calc(50% - 2.5px);
}
</style>
