<script setup lang="ts">
import { confirm, ElButton, ElMessage, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { cancelRefundOrder } from '@@/sale/apis';
import {
  useReturnedOrderDrawer,
  useReturnedOrderNonOriginDrawer,
  useSaleRefundOrder,
} from '@@/sale/hooks';

defineOptions({
  name: 'ISaleRefundOrder',
});

const { t } = useI18n();

const { Grid, gridApi, Drawer, canBatchOperate } = useSaleRefundOrder();
const { Drawer: ReturnedOrderDrawer, drawerApi: returnedOrderDrawerApi } =
  useReturnedOrderDrawer();
const {
  Drawer: ReturnedOrderNonOriginDrawer,
  drawerApi: drawerApiReturnedOrderNonOrigin,
} = useReturnedOrderNonOriginDrawer();
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
    promotion_discount_amount: row.promotion_discount_amount,
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
const cancelRefund = async (row: { id: string }) => {
  try {
    confirm({
      title: t('common.prompt-message'),
      content: t('refund-order.cancel-order-tips'),
    }).then(async () => {
      const res = await cancelRefundOrder({
        order_id: row.id,
      });
      ElMessage.success(t('common.cancelSuccess'));
      gridApi.reload();
    });
  } catch (error) {
    console.error(error);
  }
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
        <ElButton type="text">
          {{ t('common.detail') }}
        </ElButton>

        <ElButton type="text">
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
  </Page>
</template>
