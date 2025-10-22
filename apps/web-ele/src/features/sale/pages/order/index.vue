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
// 获取tag颜色
const getTagColor = (row: any) => {
  if (row.refund_status.value === 'NONE') {
    switch (row.status.value) {
      /** 已取消*/
      case 'CANCEL': {
        return { color: 'bg-[#9E9E9E]', text: row.status.label };
      }
      /** 未还款*/
      case 'NO_REPAID': {
        return { color: 'bg-primary', text: row.status.label };
      }
      /** 已支付*/
      case 'PAID': {
        return { color: 'bg-success', text: row.status.label };
      }
      /** 部分还款*/
      case 'PARTIAL_REPAID': {
        return { color: 'bg-warning', text: row.status.label };
      }
      /** 待支付*/
      case 'PENDING': {
        return { color: 'bg-primary', text: row.status.label };
      }
      /** 已还款*/
      case 'REPAID': {
        return { color: 'bg-[#4CAF50]', text: row.status.label };
      }
    }
  } else {
    switch (row.refund_status.value) {
      /** 全退*/
      case 'ALL': {
        return { color: 'bg-[#2196F3]', text: row.status.label };
      }
      /** 部分退*/
      case 'PART': {
        return { color: 'bg-[#FFC107]', text: row.status.label };
      }
    }
  }
};
const { Drawer: PrintReceiptDrawer, drawerApi: printReceiptDrawerApi } =
  useSaleOrderPrintReceiptDrawer();
const { Drawer: OrderDetailsDrawer, drawerApi: orderDetailsDrawerApi } =
  useSaleOrderDetailsDrawer();
const { Drawer: ScanOrderSettle, drawerApi: drawerApiSettle } =
  useScanOrderSettle();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #operation="{ row }">
        <ElButton
          type="text"
          v-if="row?.status.value === 'PAID'"
          @click="handleEdit(row)"
        >
          {{ t('common.print') }}
        </ElButton>
        <ElButton type="text" @click="handlePrintReceipt(row)">
          {{ t('common.print-receipt') }}
        </ElButton>
        <ElButton type="text" @click="handleOrderDetails(row)">
          {{ t('common.details') }}
        </ElButton>
        <ElButton
          type="text"
          v-if="row?.status.value === 'PENDING'"
          @click="handleSettle(row)"
        >
          {{ t('common.pay') }}
        </ElButton>
        <ElButton
          type="text"
          v-if="row?.status.value !== 'PENDING'"
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
      <template #status="{ row }">
        <div class="flex items-center justify-center gap-1.5">
          <div
            class="h-3 w-3 rounded-full"
            :class="getTagColor(row)?.color"
          ></div>
          <span>{{ getTagColor(row)?.text }}</span>
        </div>
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
