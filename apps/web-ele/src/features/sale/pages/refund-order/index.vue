<script setup lang="ts">
import { confirm, ElButton, ElMessage, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { cancelRefundOrder } from '@@/sale/apis';
import {
  useReturnedOrderDrawer,
  useReturnedOrderNonOriginDrawer,
  useSaleOrderRefundOrderDetailsDrawer,
  useSaleRefundOrder,
  useSaleRefundOrderPrintReceiptDrawer,
} from '@@/sale/hooks';

defineOptions({
  name: 'ISaleRefundOrder',
});

const { t } = useI18n();

const { Grid, gridApi, Drawer, canBatchOperate } = useSaleRefundOrder();
/** 原订单退款*/
const { Drawer: ReturnedOrderDrawer, drawerApi: returnedOrderDrawerApi } =
  useReturnedOrderDrawer();
/** 非原订单退款*/
const {
  Drawer: ReturnedOrderNonOriginDrawer,
  drawerApi: drawerApiReturnedOrderNonOrigin,
} = useReturnedOrderNonOriginDrawer();
/** 退款小票打印*/
const {
  Drawer: RefundOrderPrintReceiptDrawer,
  drawerApi: refundOrderPrintReceiptDrawerApi,
} = useSaleRefundOrderPrintReceiptDrawer();
/** 退款订单详情*/
const {
  Drawer: SaleOrderRefundOrderDetails,
  drawerApi: SaleOrderRefundOrderDetailsApi,
} = useSaleOrderRefundOrderDetailsDrawer();
/**
 * 处理退款
 * @param row 退款订单行数据
 */
const handleRefund = (row) => {
  const compuredReturnedinfo = {
    vip_discount_amount: row.vip_discount_amount,
    promotion_discount_amount: row.promotion_discount_amount,
    round_down_amount: row.round_down_amount,
    debt_deduction_amount: row.debt_deduction_amount,

    total_amount: row.total_amount,
    remaining_amount: row.remaining_amount,
    total_paid_amount: row.total_paid_amount,
  };
  if (row.type === 'NO_ORIGINAL_ORDER') {
    drawerApiReturnedOrderNonOrigin
      .setData({
        createReturnedInfo: row,
        compuredReturnedinfo,
        type: row.type,
      })
      .open();
  } else {
    returnedOrderDrawerApi
      .setData({
        createReturnedInfo: row,
        compuredReturnedinfo,
        type: row.type,
        refund_no: row.order_returned_no,
      })
      .open();
  }
  // returnedOrderDrawerApi.open();
  // drawerApiReturnedOrderNonOrigin.open();
};
/**
 * 取消退款订单
 * @param id 退款订单ID
 */
const cancelRefund = async (row: { order_id: string }) => {
  try {
    confirm({
      title: t('common.prompt-message'),
      content: t('refund-order.cancel-order-tips'),
    }).then(async () => {
      const res = await cancelRefundOrder({
        order_id: row.order_id,
      });
      ElMessage.success(t('common.cancelSuccess'));
      gridApi.reload();
    });
  } catch (error) {
    console.error(error);
  }
};
/** 查看退款订单小票*/
const handlePrintReceipt = (row: { order_returned_no: string }) => {
  refundOrderPrintReceiptDrawerApi
    .setData({
      order_no: row.order_returned_no,
    })
    .open();
};
/** 查看退款订单详情*/
const handleDetails = (row: { order_returned_no: string }) => {
  SaleOrderRefundOrderDetailsApi.setData({
    order_no: row.order_returned_no,
  }).open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="danger" v-if="canBatchOperate">
          {{ t('common.delete') }}
        </ElButton>
      </template>

      <template #operation="{ row }">
        <ElButton type="text" @click="handleDetails(row)">
          {{ t('common.detail') }}
        </ElButton>

        <ElButton type="text" @click="handlePrintReceipt(row)">
          {{ t('common.print') }}
        </ElButton>
        <ElButton
          :disabled="row.status !== 'PENDING'"
          type="text"
          @click="cancelRefund(row)"
        >
          {{ t('common.cancel') }}
        </ElButton>
        <ElButton
          :disabled="row.status !== 'PENDING'"
          type="text"
          @click="handleRefund(row)"
        >
          {{ t('common.refund') }}
        </ElButton>
      </template>
    </Grid>

    <Drawer />
    <ReturnedOrderDrawer />
    <ReturnedOrderNonOriginDrawer />
    <RefundOrderPrintReceiptDrawer />
    <SaleOrderRefundOrderDetails />
  </Page>
</template>
