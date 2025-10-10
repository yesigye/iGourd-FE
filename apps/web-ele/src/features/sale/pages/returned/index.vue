<script lang="ts" setup>
import { onMounted, provide, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ElButton, ElDialog, ElIcon, ElMessage, Page } from '@igourd/common-ui';
import { ArrowLeft, ArrowRight } from '@igourd/icons';
import { useI18n } from '@igourd/locales';

import {
  cancelRefundOrder,
  createRefund,
  getOrderList,
  getRefundPrice,
  getValidOrderItems,
  productSearchApi,
} from '@@/sale/apis';
import DrawerList from '@@/sale/components/returned/DrawerList.vue';
import ReturnedSettleAction from '@@/sale/components/returned/ReturnedSettleAction.vue';
import ReturnOrderContent from '@@/sale/components/returned/ReturnOrderContent.vue';
import ReturnOrderSearch from '@@/sale/components/returned/ReturnOrderSearch.vue';
import { useSelectCustomer, useSelectGuider } from '@@/sale/hooks';
import Decimal from 'decimal.js';

import { initializeCurrencySymbol } from '#/utils/sale';

import { columnsVisible, refundColumns } from './utils/column';

const { Drawer: SelectCustomer, drawerApi: drawerApiCustomer } =
  useSelectCustomer();
const { Drawer: SelectGuider, drawerApi: drawerApiGuider } = useSelectGuider();

// const [refundOrderRegister, { openDrawer: openRefundOrderDrawer }] =
//   useDrawer();
const { t } = useI18n();

const router = useRouter();
const dialogVisible = ref(false);
const refundColumnsData = ref([]);
const isShrink = ref(false);
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
const returnOrderList = ref([]);
provide('returnOrderList', returnOrderList);
provide('createReturedInfo', createReturedInfo);
provide('compuredReturnedinfo', compuredReturnedinfo);
const drawerDialogCustomers = ref({
  title: t('sales.selectCustomers'),
  visible: false,
  innerDrawerShow: false,
});
const drawerDialogGuider = ref({
  title: t('sales.selectGuider'),
  visible: false,
  innerDrawerShow: false,
});
const handleSelectCustomer = () => {
  drawerApiCustomer.open();
};
const handleSelectGuider = () => {
  drawerApiGuider.open();
};
const confirmClose = () => {
  drawerDialogCustomers.value.visible = false;
};
const confirmGuiderClose = () => {
  drawerDialogGuider.value.visible = false;
};

const handleSelectCustomerRow = (row) => {
  row.order_calc_product_model_list = [];
  customerDetailModel.value = row;
  compuredReturnedinfo.value = row;
};
const guiderDetailModel = ref({});
const handleSelectGuiderRow = (row) => {
  guiderDetailModel.value = row;
};
// ================================ 动态表头(暂时不需要) start ================================
const drawerListBoxShow = ref(false);
const handIsShrink = () => {
  isShrink.value = !isShrink.value;
  setTimeout(() => {
    // 触发window的resize事件，让el-table重新计算布局
    window.dispatchEvent(new Event('resize'));
  }, 300);
};
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
/**
 * 清空地址栏
 */
const handRefresh = (event) => {
  if (event.type == 'ALL') {
    router.push({
      path: '/sale/returned',
      query: {},
    });
  }
};
const handleEmptyAmount = () => {
  compuredReturnedinfo.value = {};
};
// 原单算费接口
const computedRefundAmountOriginAl = async () => {
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
    const res = await getRefundPrice(params);
    // if (res.code === 'SUCCESS') {
    compuredReturnedinfo.value = res;
    compuredReturnedProductInfo.value = res?.order_calc_product_model_list;
    // } else {
    //   ElMessage.error(res.message);
    // }
  } catch {
    console.log();
  }
};
/** 非原单模拟算费*/
const computedRefundAmountNoOriginAl = async () => {
  let totalAmount = new Decimal(0);
  let totalQuantity = new Decimal(0);
  returnOrderList.value.forEach((item) => {
    totalAmount = totalAmount.plus(
      new Decimal(item.selling_price).times(item.quantity),
    );
    totalQuantity = totalQuantity.plus(new Decimal(item.quantity));
  });
  compuredReturnedinfo.value.subtotal_amount = totalAmount
    .toDecimalPlaces(2)
    .toNumber();
  compuredReturnedinfo.value.total_amount = totalAmount
    .toDecimalPlaces(2)
    .toNumber();
  compuredReturnedinfo.value.total_paid_amount = totalAmount
    .toDecimalPlaces(2)
    .toNumber();

  compuredReturnedinfo.value.quantity = totalQuantity.toNumber();
};

// 计算退单价格
const computedRefundAmount = async () => {
  if (refundType.value === 'original_order') {
    computedRefundAmountOriginAl();
  } else {
    computedRefundAmountNoOriginAl();
  }
};
const route = useRoute();
const openRefund = () => {
  const refund_no = route.query.orderNo as string;

  openRefundOrderDrawer(true, {
    createReturnedInfo: createReturedInfo.value,
    compuredReturnedinfo: compuredReturnedinfo.value,
    type: refundType.value,
    refund_no,
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
  returnOrderParams.value.vat_amount = vat_amount || 0;

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
    let res = {};
    if (refundType.value === 'original_order') {
      returnOrderParams.value.type = 'ORIGINAL_ORDER';
      returnOrderParams.value.order_returned_item_volist =
        compuredReturnedProductInfo.value.map((item) => ({
          ...item,
        }));
      res = await createRefund(returnOrderParams.value);
    } else {
      returnOrderParams.value.order_returned_item_volist =
        returnOrderList.value.map((item) => ({
          ...item,
        }));
      returnOrderParams.value.type = 'NO_ORIGINAL_ORDER';
      res = await createNoOriginRefund(returnOrderParams.value);
    }
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
/** 原单处理选择商品*/
const originalOrderSelectGoods = async (val) => {
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

/** 非原单处理选择商品*/
const noOriginalOrderSelectGoods = async (val) => {
  if (!val || val.length === 0) {
    ElMessage.warning(t('sales.pleaseSelectProduct'));
  } else {
    const selectedItems = [];
    val.forEach((item) => {
      item.product_name = item.major_name;
      item.product_code = item.product_code;
      item.selling_price = item.selling_price;
      item.product_unit_name = item.major_unit_name;
      item.other_tax_amount = 0;
      item.promotion_discount_amount = 0;
      item.subtotal_amount = item.selling_price;
      item.quantity = 1;
      selectedItems.push({
        ...item,
        originalQuantity: 'infinity',
        quantity: item.quantity,
        displayQuantity: 'infinity',
        displayOriginalQuantity: -item.quantity,
      });
    });
    returnOrderList.value = selectedItems;
    computedRefundAmount();
  }
};
const refundType = ref('original_order');
const handleSelectRows = (event) => {
  refundType.value = event.type;
  if (event.type == 'original_order') {
    originalOrderSelectGoods(event.val);
  } else if (event.type == 'non_original_order') {
    noOriginalOrderSelectGoods(event.val);
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
  if (refundType.value == 'original_order') {
    computedRefundAmount();
  } else {
    computedRefundAmount();
  }
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
//       merchant_id: Local.get('userinfo')?.current_login_user_app?.owner_id
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
// 原始订单查询商品
const originalOrderGetGoodsList = async (val) => {
  const res = await getValidOrderItems({
    order_no: val,
  });
  // if (res.code === 'SUCCESS') {
  orderDetail.value = res;
  orderItemModelList.value = res?.order_item_model_list;
  customerDetailModel.value = res?.customer_detail_model;
  // }
};
const noOriginalOrderGetGoodsList = async (val) => {
  const res = await productSearchApi({
    keywords: val,
    business_type: 'SALE',
    // status: 'ON_SALE',
    page_num: 1,
    page_size: 10,
  });
  // if (res.code === 'SUCCESS') {
  // return res.data
  orderItemModelList.value = res?.list;
  orderItemModelList.value.forEach((item) => {
    item.product_name = item.major_name;
    item.product_code = item.product_code;
    item.selling_price = item.selling_price;
    item.product_unit_name = item.major_unit_name;
    item.other_tax_amount = 0;
    item.promotion_discount_amount = 0;
    item.subtotal_amount = item.selling_price;
    item.total_amount = item.selling_price;
    item.quantity = 1;
  });
  // }
};

// 获取有效退单的订单详情
const handleSearchAalidOrder = async (event) => {
  try {
    refundType.value = event.type;

    await (event.type === 'original_order'
      ? originalOrderGetGoodsList(event.val)
      : noOriginalOrderGetGoodsList(event.val));
  } catch (error) {
    ElMessage.error(error.message);
  }
};
const currentSymbol = ref('');
onMounted(async () => {
  currentSymbol.value = await initializeCurrencySymbol();

  // const jsonLocalTable = Local.get('CL');
  // if (jsonLocalTable && jsonLocalTable.returnTable) {
  //   allColumns.value = jsonLocalTable.returnTable?.list;
  // }
  // fetchOrderList();
});
</script>
<template>
  <Page auto-content-height>
    <section class="flex h-full flex-col justify-between">
      <!-- 搜索+搜索内容 + 客户信息 -->
      <section class="flex h-full gap-2.5">
        <!-- 扫描搜索 -->
        <div class="w-auto flex-1 overflow-hidden bg-white p-2.5">
          <ReturnOrderSearch
            :order-item-model-list="orderItemModelList"
            @select-rows="handleSelectRows"
            @search-order="handleSearchAalidOrder"
          />
          <div class="w-auto overflow-auto">
            <ReturnOrderContent
              :columns-visible="columnsVisible"
              :return-order-list="returnOrderList"
              @remove-item="handleRemoveItem"
              @update-quantity="handleUpdateQuantity"
            />
          </div>
        </div>
        <div class="relative max-w-[306px] break-words bg-white p-2.5">
          <!-- 收缩按钮 -->
          <div
            class="bg-primary-100 absolute left-0 top-[50%] flex h-10 w-4 cursor-pointer items-center justify-center"
            @click="handIsShrink"
          >
            <ArrowRight v-if="!isShrink" />
            <ArrowLeft v-else />
          </div>
          <div class="bg-primary-50 w-[286px] p-2.5 text-xs" v-if="!isShrink">
            <p class="mb-3 flex items-center justify-between">
              <ElButton
                type="primary"
                size="mini"
                @click="handleSelectCustomer"
              >
                <span class="text-info">{{
                  t('returned.select-customer')
                }}</span>
              </ElButton>
              <span class="text-sm font-bold">{{
                customerDetailModel?.name || '--'
              }}</span>
            </p>
            <p class="mb-3 flex justify-between">
              <span>{{ t('returned.customer-title') }}:</span>
              <span class="text-right">{{
                customerDetailModel?.phone_number || '--'
              }}</span>
            </p>
            <p class="mb-3 flex justify-between">
              <span>{{ t('returned.points') }}:</span>
              <span class="text-right">{{
                customerDetailModel?.points || '0'
              }}</span>
            </p>
            <p class="mb-3 flex justify-between">
              <span>{{ t('returned.balance') }}:</span>
              <span class="text-right"
                >{{ curr }} {{ customerDetailModel?.balance || '0' }}</span
              >
            </p>
            <p class="flex justify-between">
              <span>{{ t('returned.salesman') }}:</span>
              <span class="text-right">--</span>
            </p>
          </div>
          <div
            class="bg-primary-50 mt-1 w-[286px] p-2.5 text-xs"
            v-if="!isShrink"
          >
            <p class="mb-3 flex items-center justify-between">
              <ElButton type="primary" size="mini" @click="handleSelectGuider">
                <span class="text-info">{{ t('returned.select-guider') }}</span>
              </ElButton>
              <span class="text-sm font-bold">{{
                guiderDetailModel.name || '--'
              }}</span>
            </p>
            <p class="mb-3 flex justify-between">
              <span>{{ t('returned.account') }}:</span>
              <span class="text-right">--</span>
            </p>
          </div>
        </div>
      </section>

      <!-- 退款操作层 -->
      <section class="mt-2.5 flex h-auto">
        <!-- 客户信息 -->
        <!-- <div class="scan-settle-content-left">
          <CustomerInfo :customer-detail-model="customerDetailModel" />
        </div> -->

        <div class="w-full bg-white pb-2.5 pt-2.5">
          <!-- 退货结算 -->
          <ReturnedSettleAction
            :order-detail="orderDetail"
            :return-order-list="returnOrderList"
            :compured-returnedinfo="compuredReturnedinfo"
            @handle-refund="handleRefund"
            @handle-empty="handleEmptyAll"
          />
        </div>
      </section>
    </section>
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
    <!-- <RefundOrder
      @register="refundOrderRegister"
      @success="handRefresh"
      @close="handRefresh"
      @close-tkr="handleClose"
      @handle-empty="handleEmptyAll"
      @handle-empty-amount="handleEmptyAmount"
    /> -->
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
                  no: refundColumnsData?.[0]?.order_returned_no || '',
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

    <SelectCustomer
      @close-tkr="confirmClose"
      @select-customer-row:row="handleSelectCustomerRow"
    />
    <SelectGuider
      @close-tkr="confirmGuiderClose"
      @select-customer-row:row="handleSelectGuiderRow"
    />
  </Page>
</template>
<style lang="scss"></style>
<style scoped lang="scss">
.common-btn {
  width: 80px;
  height: 32px;
  color: #fff;
}
</style>
