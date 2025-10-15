<script setup lang="ts">
import { useRouter } from 'vue-router';

import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSaleOrder, useSaleOrderPrintReceiptDrawer } from '@@/sale/hooks';

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
const handlePrintReceipt = (row: { order_no: string }) => {
  printReceiptDrawerApi.setData({ order_no: row.order_no }).open();
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
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.details') }}
        </ElButton>
        <ElButton
          type="text"
          v-if="row.status === 'PENDING'"
          @click="handleEdit(row)"
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
    <ReturnedOrderDrawer />
    <PrintReceiptDrawer />
  </Page>
</template>
