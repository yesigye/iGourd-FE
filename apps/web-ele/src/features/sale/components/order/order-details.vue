<script setup lang="ts">
import type { RefundOrderDetail } from '@@/sale/types';

import type { VxeGridProps, VxeGridPropTypes } from '#/adapter/vxe-table';

import { ref } from 'vue';

import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { orderDetailApi } from '@@/sale/apis';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { PageTitle } from '#/components';
import { initializeCurrencySymbol } from '#/utils/sale';

defineOptions({
  name: 'SaleOrderDetailsDrawer',
});
const currency = ref('');
const { t } = useI18n();
// 商品表格配置
const productColumns: VxeGridPropTypes.Column<RefundOrderDetail>[] = [
  {
    field: 'product_code',
    title: t('refund-order.product-code'),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'product_name',
    title: t('refund-order.product'),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'sku_barcode',
    title: t('refund-order.sku-barcode'),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'product_unit_name',
    title: t('common.unit'),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'quantity',
    title: t('refund-order.sales-qty'),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'product_spec_kvmessage',
    title: t('refund-order.spec'),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'cost_price',
    title: t('refund-order.const-price', {
      currency: currency.value,
    }),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'selling_price',
    title: t('refund-order.selling-price', {
      currency: currency.value,
    }),
    minWidth: 170,
    align: 'left',
  },
];
// 支付历史表格配置
const payHistoryColumns: VxeGridPropTypes.Column<RefundOrderDetail>[] = [
  {
    field: 'time',
    title: t('refund-order.refund-time'),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'menthod',
    title: t('refund-order.payment-method'),
    minWidth: 170,
    align: 'left',
  },
  {
    field: 'amount',
    title: t('refund-order.amount'),
    minWidth: 170,
    align: 'left',
  },
];
const productGridOptions: VxeGridProps<RefundOrderDetail> = {
  columns: productColumns,
  height: '',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        if (!orderDetail.value) {
          return [];
        }
        return orderDetail.value.order_item_model_list || [];
      },
    },
  },
};
const payHistoryGridOptions: VxeGridProps<RefundOrderDetail> = {
  columns: payHistoryColumns,
  height: '',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        if (!orderDetail.value || orderDetail.value.status !== 'REFUNDED') {
          return [];
        }
        if (!orderDetail.value.refund_method_amount) {
          return [];
        }
        const payMenthod = JSON.parse(orderDetail.value.refund_method_amount);
        const history = [];
        for (const key in payMenthod) {
          history.push({
            time: orderDetail.value?.refund_time,
            menthod: key,
            amount: payMenthod[key],
          });
        }
        return history;
      },
    },
  },
};
const [RefundOrderDetailProductGrid, RefundOrderDetailProductGridApi] =
  useIgourdVxeGrid({
    gridOptions: productGridOptions,
  });
const [RefundOrderDetailPayHistoryGrid, RefundOrderDetailPayHistoryGridApi] =
  useIgourdVxeGrid({
    gridOptions: payHistoryGridOptions,
  });
const orderDetail = ref<RefundOrderDetail>();
// 获取订单详情
const handleOrderDetail = async (order_no: string) => {
  const result = await orderDetailApi({ order_no });
  orderDetail.value = result;
  RefundOrderDetailProductGridApi.reload();
  RefundOrderDetailPayHistoryGridApi.reload();
};
const [Drawer, drawerApi] = useIgourdDrawer({
  async onOpenChange(val) {
    if (val) {
      const { order_no } = drawerApi.getData();
      currency.value = await initializeCurrencySymbol();
      await handleOrderDetail(order_no);
    }
  },
});
</script>
<template>
  <Drawer>
    <PageTitle :title="t('refund-order.refund-information')" />
    <section class="px-3">
      <ElDescriptions :column="3" :size="size" border>
        <ElDescriptionsItem :label="t('refund-order.customer')">
          {{ orderDetail?.customer_detail_model?.name || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('refund-order.creation-time')">
          {{ orderDetail?.create_time || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('refund-order.refund-time')">
          {{ orderDetail?.refund_time || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('refund-order.this-refund')">
          {{ orderDetail?.total_amount || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('refund-order.actual-refund-amt')">
          {{ orderDetail?.total_paid_amount || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('refund-order.still-balance')">
          {{ orderDetail?.current_remaining_amount || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('refund-order.refund-qty')">
          {{ orderDetail?.total_quantity || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('refund-order.cashier')">
          {{ orderDetail?.guider_name || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('refund-order.status')">
          {{ orderDetail?.status || '--' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </section>
    <PageTitle :title="t('refund-order.product-details')" />
    <section><RefundOrderDetailProductGrid /></section>
    <PageTitle :title="t('refund-order.refund-history')" />
    <section><RefundOrderDetailPayHistoryGrid /></section>
    <template #footer>
      <ElButton type="primary" size="default" @click="drawerApi.close()">
        {{ t('common.close') }}
      </ElButton>
    </template>
  </Drawer>
</template>
