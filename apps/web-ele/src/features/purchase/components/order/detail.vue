<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { defineExpose, ref } from 'vue';

import {
  ElButton,
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
  useIgourdDrawer,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { settlePurchaseOrderApi } from '@@/purchase/apis';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

const { t } = useI18n();

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const gridOptions: VxeGridProps<RowType> = {
  id:"purchase-detail-grid",
  columns: [
    { title: t('purchase.major-name'), field: 'major_name' },
    { title: t('purchase.code'), field: 'product_code' },
    { title: t('purchase.unit-name'), field: 'major_unit_name' },
    {
      title: t('purchase.unit-rate'),
      field: 'price',
      // slots: {
      //   default: 'unit',
      // },
    },
    { title: t('purchase.cost_price'), field: 'cost_price' },
    { title: t('purchase.quantity'), field: 'stock_total_quantity_message' },
  ],
  editConfig: {
    mode: 'cell',
    trigger: 'click',
  },
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const result = {
          list: detailData.value.productList,
          page_num: '1',
          page_size: '20',
          pages: '1',
          total: '6',
        };
        return result;
      },
    },
  },
  showOverflow: true,
};

const detailData = ref(null);
const modeRef = ref<string>('');
const { currentLoginUserApp } = useUserStore();
const [Grid] = useIgourdVxeGrid({ gridOptions });

const [Drawer, drawerApi] = useIgourdDrawer({
  async onOpenChange(isOpen,a,b) {
    if (isOpen) {
      const data = drawerApi.getData();
      detailData.value = data;
    }
  },
});
const handle = () => {
  const params = {
    purchase_order_id: detailData.value.id,
    merchant_id: currentLoginUserApp.owner_id,
    purchase_order_no: detailData.value.purchase_order_no,
  };
  settlePurchaseOrderApi(params).then((res) => {
    drawerApi.close();
  });
};
const open = (detail: any, mode: string) => {
  detailData.value = detail;
  modeRef.value = mode;
  drawerApi.open();
};
const close = () => {
  drawerApi.close();
};
defineExpose({ open, close });
</script>

<template>
  <Drawer class="w-full">
    <ElCard class="mt-1">
      <div class="text-sm">
        {{t('purchase.purchaseorderno')}}<span class="text-red-500">{{
          detailData.purchase_order_no
        }}</span>{{t('purchase.creator')}}：<span class="text-red-500">{{ detailData.creator_name }}</span>
      </div>
    </ElCard>
    <ElCard class="mt-1">
      <template #header>
        <div class="title">{{t('common.basic-info')}}</div>
      </template>
      <ElDescriptions title="" :column="3" border>
        <ElDescriptionsItem :label="t('purchase.merchantname')">
          {{ detailData.merchant_name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.purchaseorderno')">
          {{ detailData.purchase_order_no }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.warehouse-name')">
          {{ detailData.warehouse_name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.vendor')">
          {{ detailData.vendor_name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.date')">
          {{ detailData.purchase_date }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.vat')">
          {{ detailData.vat_amount }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.other-tax')">
          {{ detailData.other_tax_amount }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.currency')">
          {{ detailData.currency_code }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.remark')">
          {{ detailData.remark }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.total-amount')">
          {{ detailData.subtotal_amount }}
        </ElDescriptionsItem>
        <ElDescriptionsItem :label="t('purchase.remark')">
          {{ detailData.deposit_amount }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
    <ElCard class="mt-1">
      <template #header>
        <div class="title">{{t('purchase.products-details')}}</div>
      </template>
      <Grid>
        <template #unit="{ row }">
          <div>1: {{ row.basic_unit_radio }}</div>
        </template>
      </Grid>
    </ElCard>
    <ElCard class="mt-1">
      <template #header>
        <div class="title">{{t('purchase.attachment')}}</div>
      </template>
    </ElCard>
    <template #footer>
      <ElButton @click="close">
        {{ t('common.cancel') }}
      </ElButton>
      <ElButton type="primary" v-if="modeRef === 'close'" @click="handle">
        {{ t('common.close') }}
      </ElButton>
    </template>
  </Drawer>
</template>
<style>
.title::before {
  position: relative;
  top: 2px;
  bottom: 0;
  left: -8px;
  width: 1px;
  height: 16px;
  content: ' ';
  border-left: hsl(var(--primary)) 6px solid;
  border-radius: calc(var(--radius) - 2px);
}
</style>
