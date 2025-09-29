<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, ElTooltip, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getProductSalesStatsApi } from '@@/report/apis/sales';
import { useSalesReport } from '@@/report/hooks';

defineOptions({
  name: 'ISalesReport',
});

const { t } = useI18n();
const { Grid, gridApi, Drawer, handleEdit, queryData } = useSalesReport();
const staticsData = ref<ProductSalesStatsResponse>({});
const getStaticsData = async () => {
  const res = await getProductSalesStatsApi({
    ...queryData,
  });
  staticsData.value = res || {};
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #operation="{ row }">
        <ElButton type="text" @click="handleEdit(row)">
          {{ t('common.detail') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex flex-wrap gap-2.5 text-xs">
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('sales.sales-qty') }}:</span>
            <span class="text-warning">{{
              staticsData.sale_quantity || 0
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('sales.remain-qty') }}:</span>
            <span class="text-warning">{{
              staticsData.remain_quantity || 0
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('sales.cost-amount') }}:</span>
            <span class="text-warning">{{ staticsData.cost_amount || 0 }}</span>
            <ElTooltip
              class="box-item"
              effect="dark"
              content="This figure is calculated based on the actual cost price of the products sold in the order"
              placement="top-start"
            >
              <i class="iconfont icon-icon_Question_mark">11</i>
            </ElTooltip>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('sales.sales-amount') }}:</span>
            <span class="text-warning">{{ staticsData.sale_amount || 0 }}</span>
            <ElTooltip
              class="box-item"
              effect="dark"
              content="This figure is calculated based on the actual selling price of the products sold in the order"
              placement="top-start"
            >
              <i class="iconfont icon-icon_Question_mark">11</i>
            </ElTooltip>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('sales.sales-gross-margin-rate') }}:</span>
            <span class="text-warning">{{
              staticsData.gross_margin_amount || 0
            }}</span>
          </p>
        </div>
        <ElButton type="primary" @click="getStaticsData">总计</ElButton>
      </div>
    </template>
  </Page>
</template>
