<script setup>
import { onMounted, provide, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';

import { ElButton, ElDialog, ElIcon } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  cancelRefundOrder,
  createRefund,
  getOrderList,
  getOrderPriceApi,
  getValidOrderItems,
} from '@@/sale/apis';
import CustomerInfo from '@@/sale/components/returned/CustomerInfo.vue';
import DrawerList from '@@/sale/components/returned/DrawerList.vue';
import RefundOrder from '@@/sale/components/returned/RefundOrder.vue';
import ReturnedSettleAction from '@@/sale/components/returned/ReturnedSettleAction.vue';
import ReturnOrderContent from '@@/sale/components/returned/ReturnOrderContent.vue';
import ReturnOrderSearch from '@@/sale/components/returned/ReturnOrderSearch.vue';
import Decimal from 'decimal.js';
import { ElMessage } from 'element-plus';

import { columnsVisible, refundColumns } from './utils/column.tsx';

// const [refundOrderRegister, { openDrawer: openRefundOrderDrawer }] =
//   useDrawer();
const { t } = useI18n();

const router = useRouter();
const dialogVisible = ref(false);
const refundColumnsData = ref([]);
// 创建退单参数
const returnOrderParams = ref({
  merchant_id: null,
  channel: 'WEB',
  customer_id: null,
  device_id: null,
  guider_id: null,
  order_returned_item_volist: [
    {
      cost_price: null,
      currency_code: '',
      order_id: null,
      order_no: null,
      order_returned_id: null,
      order_returned_no: null,
      origin_price: null,
      other_tax_amount: null,
      price: null,
      product_barcode: '',
      product_code: '',
      product_id: null,
      product_name: '',
      product_profile_photo: '',
      product_unit_id: null,
      product_unit_name: '',
      promotion_discount_amount: null,
      quantity: null,
      selling_price: null,
      subtotal_amount: null,
      total_amount: null,
      vat_amount: null,
      vip_discount_amount: null,
    },
  ],
  refund_difference_amount: null,
  order_returned_no: '',
  other_tax_amount: null,
  payment_balance_amount: null,
  payment_card_amount: null,
  payment_card_type: 'CREDIT_CARD',
  payment_cash_amount: null,
  payment_method: [],
  payment_third_party_amount: null,
  payment_third_party_type: '',
  devive_code: null,
  pos_user_id: null,
  price_level_id: null,
  promotion_discount_amount: null,
  round_down_amount: null,
  salesman_id: null,
  status: 'PENDING',
  subtotal_amount: null,
  total_amount: null,
  total_paid_amount: null,
  vat_amount: null,
  vat_configuration: 'VAT_INCLUSIVE',
  vip_discount_amount: null,
});
const state = reactive({
  orderList: [],
  orderDetail: {},
  orderItemModelList: [],
  customerDetailModel: {},
  // 计算返回数据
  compuredReturnedinfo: {},
  // 计算的每个商品的数据
  compuredReturnedProductInfo: [],
  // 创建订单返回数据
  createReturedInfo: {},
});
const {
  orderDetail,
  orderList,
  orderItemModelList,
  customerDetailModel,
  createReturedInfo,
  compuredReturnedinfo,
  compuredReturnedProductInfo,
} = toRefs(state);
const showRefundDialog = ref(false);
const refundTitle = ref('');
const returnOrderList = ref([]);
provide('returnOrderList', returnOrderList);
provide('createReturedInfo', createReturedInfo);
provide('compuredReturnedinfo', compuredReturnedinfo);

// ================================ 动态表头(暂时不需要) start ================================
const drawerListBoxShow = ref(false);
const showLocalTables = () => {
  drawerListBoxShow.value = true;
};
const confirmList = (val) => {
  allColumns.value = val;
  drawerListBoxShow.value = false;
};
const confirmListClose = () => {
  drawerListBoxShow.value = false;
};
const handleClose = () => {
  showRefundDialog.value = false;
};
// ================================ 动态表头(暂时不需要) end ================================
// 清空列表
const handleEmptyAll = () => {
  returnOrderList.value = [];
  orderItemModelList.value = [];
  compuredReturnedProductInfo.value = [];
  customerDetailModel.value = {};
  handleEmptyAmount();
};
const handleEmptyAmount = () => {
  compuredReturnedinfo.value = {};
};

// 计算退单价格
const computedRefundAmount = async () => {
  const params = {
    merchant_id: '',
    order_no: '',
    order_returned_calc_product_volist: [],
  };

  params.order_no = orderDetail.value?.order_no;

  params.order_returned_calc_product_volist = returnOrderList.value.map(
    (item) => ({
      product_code: item.product_code,
      product_id: item.product_id,
      product_unit_id: item.product_unit_id,
      product_unit_name: item.product_unit_name,
      quantity: item.quantity,

      // 以下字段为共享库存新增字段
      product_profile_id: item.product_profile_id || '',
      basic_product_id: item.basic_product_id || '',
      basic_unit_id: item.basic_unit_id || '',
      basic_unit_name: item.basic_unit_name || '',
      basic_unit_radio: item.basic_unit_radio || '',
      warehouse_id: item.warehouse_id || '',
      warehouse_name: item.warehouse_name || '',
    }),
  );

  try {
    const res = await getOrderPriceApi(params);
    if (res.code === 'SUCCESS') {
      compuredReturnedinfo.value = res?.data;
      compuredReturnedProductInfo.value =
        res?.data?.order_calc_product_model_list;
    } else {
      ElMessage.error(res.message);
    }
  } catch {
    console.log();
  }
};
const openRefund = () => {
  openRefundOrderDrawer(true, {
    createReturnedInfo: createReturedInfo.value,
    compuredReturnedinfo: compuredReturnedinfo.value,
  });
};
// 添加退单
const addReturned = async () => {
  returnOrderParams.value.customer_id = customerDetailModel.value?.id;
  returnOrderParams.value.order_no = orderDetail.value?.order_no;
  returnOrderParams.value.order_id = orderDetail.value?.id;
  returnOrderParams.value.subtotal_amount =
    compuredReturnedinfo.value.subtotal_amount;
  returnOrderParams.value.round_down_amount =
    compuredReturnedinfo.value?.round_down_amount;
  returnOrderParams.value.order_returned_item_volist =
    compuredReturnedProductInfo.value.map((item) => ({
      ...item,
    }));
  returnOrderParams.value.total_amount =
    compuredReturnedinfo.value.total_amount;
  returnOrderParams.value.total_amount_compatible =
    returnOrderParams.value.total_amount;
  let promotionDiscountAmount = 0;
  returnOrderParams.value.order_returned_item_volist.forEach((item) => {
    promotionDiscountAmount = Decimal(
      Number(promotionDiscountAmount) + Number(item.promotion_discount_amount),
    );
  });
  let vat_amount = 0;
  returnOrderParams.value.order_returned_item_volist.forEach((item) => {
    vat_amount = Decimal(Number(vat_amount) + Number(item.vat_amount));
  });
  returnOrderParams.value.promotion_discount_amount = promotionDiscountAmount;
  returnOrderParams.value.vat_amount = vat_amount;

  returnOrderParams.value.total_paid_amount =
    compuredReturnedinfo.value?.total_paid_amount;

  returnOrderParams.value.refund_difference_amount =
    compuredReturnedinfo.value.promotion_discount_amount +
    compuredReturnedinfo.value.round_down_amount +
    compuredReturnedinfo.value.vip_discount_amount;

  returnOrderParams.value.sale_discount_amount =
    compuredReturnedinfo.value.vip_discount_amount +
    compuredReturnedinfo.value.promotion_discount_amount;
  returnOrderParams.value.vip_discount_amount =
    compuredReturnedinfo.value.vip_discount_amount;
  returnOrderParams.value.debt_deduction_amount = compuredReturnedinfo.value
    .debt_deduction_amount
    ? compuredReturnedinfo.value.debt_deduction_amount
    : 0;
  returnOrderParams.value.remaining_amount =
    compuredReturnedinfo.value.remaining_amount;

  try {
    const res = await createRefund(returnOrderParams.value);
    if (res.code === 'SUCCESS') {
      if (res.data.is_exists) {
        refundColumnsData.value = [res?.data.order_returned_detail_model];
        dialogVisible.value = true;
        createReturedInfo.value = res?.data.order_returned_detail_model;
      } else {
        ElMessage.success(t('sales.returnedCreatedSuccessfully'));
        createReturedInfo.value = {
          order_returned_no: res.data.order_returned_no,
        };
        openRefund();
      }

      // handleSettleEmpty();
    } else {
      ElMessage.error(res.message);
    }
  } catch {
    // ElMessage.error(error?.message);
  }
};
const handleCancelAndOperate = () => {
  dialogVisible.value = false;
  router.push({
    path: '/sale/refund-order',
    query: {
      order_no: refundColumnsData.value[0].order_returned_no,
    },
  });

  // openRefund()
};
const handleContinueCreate = async () => {
  const res = await cancelRefundOrder({
    order_id: refundColumnsData.value[0].order_id,
  });
  if (res.code === 'SUCCESS') {
    dialogVisible.value = false;

    addReturned();
  }
};
// 处理退单数量
const handleUpdateQuantity = (updatedItem) => {
  const index = returnOrderList.value.findIndex(
    (item) => item.product_id === updatedItem.product_id,
  );
  if (index !== -1) {
    returnOrderList.value[index].quantity = updatedItem.quantity;
  }
  // 重新计算退单价格
  computedRefundAmount();
};

const handleRemoveItem = (itemToRemove) => {
  returnOrderList.value = returnOrderList.value.filter(
    (item) => item.product_id !== itemToRemove.product_id,
  );
  // 更新orderItemModelList
  returnOrderList.value = returnOrderList.value.filter(
    (item) => item.product_id !== itemToRemove.product_id,
  );
  // 重新计算退单价格
  computedRefundAmount();
};

const handleSelectRows = (val) => {
  if (!val || val.length === 0) {
    ElMessage.warning(t('sales.pleaseSelectProduct'));
  } else {
    // Create a new array from the selected items
    const selectedItems = [];
    val.forEach((item) => {
      selectedItems.push({
        ...item,
        originalQuantity: item.quantity,
        quantity: item.quantity,
        displayQuantity: -item.quantity,
        displayOriginalQuantity: -item.quantity,
      });
    });
    returnOrderList.value = selectedItems;
    // 转换returnOrderList
    handleReturnOrderListQuantity();
    // 计算退单价格
    computedRefundAmount();
  }
};

const transformReturnQuantityList = ref([]);

const handleReturnOrderListQuantity = () => {
  transformReturnQuantityList.value = returnOrderList.value.map((item) => ({
    ...item,
    quantity: -item.quantity,
  }));
};

const handleRefund = async () => {
  // 添加退单
  await addReturned();
};
// 获取订单列表
const fetchOrderList = async () => {
  try {
    const res = await getOrderList({
      page_size: 10_000,
    });
    orderList.value = res.data?.list;
  } catch {
    // ElMessage.error(error.message);
  }
};

// 获取订单详情
// const handleSearchOrder = async val => {
//   try {
//     const res = await OrderService.getOrderDetail({
//       order_no: val,
//     });
//     if (res.code === 'SUCCESS') {
//       orderDetail.value = res?.data;
//       orderItemModelList.value = res.data?.order_item_model_list;
//       customerDetailModel.value = res.data?.customer_detail_model;
//     }
//   } catch (error) {
//     // ElMessage.error(error.message);
//   }
// };
// 获取有效退单的订单详情
const handleSearchAalidOrder = async (val) => {
  try {
    const res = await getValidOrderItems({
      order_no: val,
    });
    if (res.code === 'SUCCESS') {
      orderDetail.value = res?.data;
      orderItemModelList.value = res.data?.order_item_model_list;
      customerDetailModel.value = res.data?.customer_detail_model;
    }
  } catch {
    // ElMessage.error(error.message);
  }
};

onMounted(() => {
  // const jsonLocalTable = Local.get('CL');
  // if (jsonLocalTable && jsonLocalTable.returnTable) {
  //   allColumns.value = jsonLocalTable.returnTable?.list;
  // }
  // fetchOrderList();
});
</script>
<template>
  <div>
    <div class="scancode-container">
      <div class="top">
        <!-- 扫描搜索 -->
        <ReturnOrderSearch
          :order-item-model-list="orderItemModelList"
          @select-rows="handleSelectRows"
          @search-order="handleSearchAalidOrder"
        />
      </div>
      <div class="down">
        <div class="down-table">
          <!-- 扫描内容 -->
          <ReturnOrderContent
            :columns-visible="columnsVisible"
            :return-order-list="returnOrderList"
            @remove-item="handleRemoveItem"
            @update-quantity="handleUpdateQuantity"
          />
        </div>
      </div>
      <!-- 结算 -->
      <div class="scan-settle">
        <div class="scan-settle-content-left">
          <!-- 客户信息 -->
          <CustomerInfo :customer-detail-model="customerDetailModel" />
        </div>
        <div class="scan-settle-content-right">
          <!-- 退货结算 -->
          <ReturnedSettleAction
            :order-detail="orderDetail"
            :return-order-list="returnOrderList"
            :compured-returnedinfo="compuredReturnedinfo"
            @handle-refund="handleRefund"
            @handle-empty="handleEmptyAll"
          />
        </div>
      </div>
    </div>
    <!--抽屉列表-->
    <DrawerList
      :drawer-info-show="drawerListBoxShow"
      :list="columnsVisible"
      cache-key="returnTable"
      version="1.0.0"
      @close-tk="confirmListClose"
      @confirm-list="confirmList"
    />
    <!-- 退单抽屉 -->
    <RefundOrder
      @register="refundOrderRegister"
      @success="refresh"
      @close="refresh"
      @close-tkr="handleClose"
      @handle-empty="handleEmptyAll"
      @handle-empty-amount="handleEmptyAmount"
    />
    <ElDialog
      v-model="dialogVisible"
      :title="t('common.prompt_message')"
      width="720"
      type="warning"
    >
      <div class="flex gap-2">
        <ElIcon class="mt-1" size="18">
          <WarningFilled />
        </ElIcon>
        <div>
          <div class="text-sm">
            <p>{{ t('sales.this_order_has_created_a_Refund_order') }}</p>
            <p class="mt-5 font-bold">
              {{
                t('sales.continue_create_prompt', {
                  no: refundColumnsData[0].order_returned_no || '',
                })
              }}
              <span class="text-error">{{ t('sales.delete_no') }}</span> ,
              {{ t('sales.create_new_refund_order') }}!
            </p>
            <p class="mt-1 font-bold">{{ t('sales.cancel_and_operation') }}</p>
          </div>
          <div>
            <IgourdElTable
              :el-table-prop="{
                i18n: t,
                data: refundColumnsData,
                hideActionColumn: true,
              }"
              :columns="refundColumns({ i18n: t })"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <div
          class="dialog-footer flex items-center justify-between pb-2.5 pt-2.5"
        >
          <ElButton @click="handleCancelAndOperate">
            <span class="text-error">{{
              t('sales.cancel_and_operation_confirm')
            }}</span>
          </ElButton>
          <div>
            <ElButton
              class="border-primary border border-solid"
              @click="dialogVisible = false"
            >
              <span class="text-primary">{{ t('sales.close') }}</span>
            </ElButton>
            <ElButton type="primary" @click="handleContinueCreate">
              <span class="text-white">{{ t('sales.continue_create') }}</span>
            </ElButton>
          </div>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
<style lang="scss"></style>
<style scoped lang="scss">
.scancode-container {
  width: 100%;
  overflow: hidden;

  .top {
    // height: 100px;
    padding: 10px 0;
    background-color: #fff;
  }

  .down {
    // padding: 10px 21px 15px 21px;
    height: calc(100vh - 310px);
    margin-top: 6px;
    overflow-y: auto;
    background-color: #fff;

    .down-delete {
      // height: 50px;
      display: flex;
      justify-content: space-between;
      padding-top: 10px;

      .del-btn {
        margin-left: 14px;
        background-color: #fc5c65;
      }

      .import-btn {
        color: #fff;
        background-color: #4a9ffc;
      }
    }

    .down-table {
      // overflow-y: auto;
      flex-grow: 1;
      margin: 10px 21px 0;

      .role-page {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }

      .table {
        box-shadow: 5px 5px 5px #dedede;
      }

      .custom-header {
        background-color: #183f8f;
      }

      .icon-bianji1,
      .icon-chakan,
      .icon-icon_printer {
        width: 20px;
        height: 20px;
        color: #5e7987;
      }
    }

    .down-btn {
      .total {
        margin-top: 20px;
      }
    }

    .action-bottom {
      display: flex;
      justify-content: space-between;
      padding-bottom: 49px;
    }
  }

  .scan-settle {
    display: flex;
    // justify-content: space-between;
    height: auto;
    margin-top: 10px;

    .scan-settle-content-left {
      width: 25%;
      background-color: #fff;
    }

    .scan-settle-content-right {
      width: 75%;
      padding: 10px 0;
      margin-left: 10px;
      background-color: #fff;
    }
  }
}

.common-btn {
  width: 80px;
  height: 32px;
  color: #fff;
}
</style>
