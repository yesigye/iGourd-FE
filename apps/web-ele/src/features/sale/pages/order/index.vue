<script setup lang="ts">
import { provide, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import {
  useSaleOrder,
  useSaleOrderDetailsDrawer,
  useSaleOrderPrintReceiptDrawer,
  useScanOrderSettle,
} from '@@/sale/hooks';

defineOptions({
  name: 'ISaleOrder',
});

const router = useRouter();
const { t } = useI18n();
const {
  Grid,
  Drawer,
  handleEdit,
  canBatchOperate,
  handleBatchDelete,
  handleCancel,
} = useSaleOrder();

const handleRefund = (row) => {
  router.push({
    path: '/sale/returned',
    query: { orderNo: row.order_no },
  });
};
const { Drawer: PrintReceiptDrawer, drawerApi: printReceiptDrawerApi } =
  useSaleOrderPrintReceiptDrawer();
const { Drawer: OrderDetailsDrawer, drawerApi: orderDetailsDrawerApi } =
  useSaleOrderDetailsDrawer();
const { Drawer: ScanOrderSettle, drawerApi: drawerApiSettle } =
  useScanOrderSettle();
const handlePrintReceipt = (row: { order_no: string }) => {
  printReceiptDrawerApi.setData({ order_no: row.order_no }).open();
};
const handleOrderDetails = (row: { order_no: string }) => {
  orderDetailsDrawerApi.setData({ order_no: row.order_no }).open();
};
const orderData = ref({});
const currentId = ref('');
const calculateOrderList = ref({});
const customerInfo = ref({});
provide('calculateOrderList', calculateOrderList);
provide('customerInfo', customerInfo);
provide('orderData', orderData);
const handleSettle = (event: {
  balance: number;
  customer_id: number;
  customer_mobile: string;
  order_no: string;
  total_amount: number;
}) => {
  currentId.value = event.order_no;
  calculateOrderList.value = {
    total_amount: event.total_amount,
    customer_id: event.customer_id,
  };
  customerInfo.value = {
    balance: event.balance,
    mobile: event.customer_mobile,
  };
  orderData.value = {
    order_no: event.order_no,
    total_amount: event.total_amount,
    customer_id: event.customer_id,
  };
  drawerApiSettle
    .setData({
      currentId: currentId.value,
      calculateOrderList: calculateOrderList.value,
      customerInfo: customerInfo.value,
      orderData: orderData.value,
    })
    .open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton
          type="danger"
          v-if="canBatchOperate"
          @click="handleBatchDelete"
        >
          {{ t('common.delete') }}
        </ElButton>
      </template>
      <template #operation="{ row }">
        <ElButton
          type="text"
          v-if="row.status === 'PAID'"
          @click="handleEdit(row)"
        >
          {{ t('common.print') }}
        </ElButton>
        <ElButton
          type="text"
          v-if="row.status === 'PAID'"
          @click="handlePrintReceipt(row)"
        >
          {{ t('common.print-receipt') }}
        </ElButton>
        <ElButton type="text" @click="handleOrderDetails(row)">
          {{ t('common.details') }}
        </ElButton>
        <ElButton
          type="text"
          v-if="row.status === 'PENDING'"
          @click="handleSettle(row)"
        >
          {{ t('common.pay') }}
        </ElButton>
        <ElButton
          type="text"
          v-if="row.status !== 'PENDING'"
          @click="handleRefund(row)"
        >
          {{ t('common.refund') }}
        </ElButton>
        <ElButton
          type="text"
          v-if="row.status !== 'PENDING'"
          @click="handleCancel(row)"
        >
          {{ t('common.cancel') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
    <PrintReceiptDrawer />
    <OrderDetailsDrawer />
    <ScanOrderSettle
      :order-data="orderData"
      @close-tkr="confirmClosePay"
      @handle-empty="handleSettleEmpty"
    />
  </Page>
</template>
