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
  columns: [
    { title: '商品编码', field: 'product_code' },
    { title: '商品名称', field: 'major_name' },
    { title: 'SKU编码', field: 'sku_barcode' },
    { title: '退款数量', field: 'major_unit_name' },
    { title: '单位', field: 'basic_unit_name' },
    {
      title: '单位比率',
      field: 'price',
      slots: {
        default: 'unit',
      },
    },
    { title: '主单位', field: 'product_unit_name' },
    { title: '规格', field: 'product_spec_kvmessage' },
    { title: '成本价格', field: 'cost_price' },
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
const paymentDetail = ref(null);
const modeRef = ref<string>('');
const { currentLoginUserApp } = useUserStore();
const [Grid] = useIgourdVxeGrid({ gridOptions });

const [Drawer, drawerApi] = useIgourdDrawer({
  async onOpenChange(isOpen, a, b) {
    if (isOpen) {
      const data = drawerApi.getData();
      detailData.value = data;
      paymentDetail.value = data.purchase_payment_plan_detail_model_list[0]
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
        订单号：<span class="text-red-500">{{
          detailData.purchase_order_no
        }}</span
        >创建者：<span class="text-red-500">{{ detailData.creator_name }}</span>
      </div>
    </ElCard>
    <ElCard class="mt-1">
      <template #header>
        <div class="title">基础信息</div>
      </template>
      <ElDescriptions title="" :column="3" border>
        <ElDescriptionsItem label="退货日期">
          {{ detailData.returned_date }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="VAT配置">
          {{ detailData.vat_configuration }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="退货原因">
          {{ detailData.return_reason }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="订单状态">
          {{ detailData.review_status }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="VAT税额">
          {{ detailData.vat_amount }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="退款账号">
          {{ paymentDetail.account_name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="供应商名称">
          {{ detailData.vendor_name }}
        </ElDescriptionsItem>

        <ElDescriptionsItem label="其他税">
          {{ detailData.other_tax_amount }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="退款方式">
          {{ paymentDetail.payment_method_name }}
        </ElDescriptionsItem>

        <ElDescriptionsItem label="仓库">
          {{ detailData.warehouse_name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="优惠">
          {{ detailData.discount_amount }}
        </ElDescriptionsItem>

        <ElDescriptionsItem label="总金额">
          {{ detailData.subtotal_amount }}
        </ElDescriptionsItem>

        <ElDescriptionsItem label="货币">
          {{ detailData.currency_code }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="合计">
          {{ detailData.total_amount }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="订单号">
          {{ detailData.purchase_returned_no }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注">
          {{ detailData.remark }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElCard>
    <ElCard class="mt-1">
      <template #header>
        <div class="title">产品详情</div>
      </template>
      <Grid>
        <template #unit="{ row }">
          <div>1: {{ row.basic_unit_radio }}</div>
        </template>
      </Grid>
    </ElCard>
    <ElCard class="mt-1">
      <template #header>
        <div class="title">附件</div>
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
