<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getInventoryStatsApi } from '@@/report/apis';
import { useInventoryReport } from '@@/report/hooks';

defineOptions({
  name: 'IInventoryReport',
});

const { t } = useI18n();
const { Grid, Drawer, queryData } = useInventoryReport();
const staticsData = ref<ProductSalesStatsResponse>({});
const getStaticsData = async () => {
  const res = await getInventoryStatsApi({
    ...queryData,
  });
  staticsData.value = res || {};
};
</script>

<template>
  <Page auto-content-height>
    <Grid />
    <Drawer />
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex flex-wrap gap-2.5 text-xs">
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('inventory.qty-increased') }}:</span>
            <span class="text-warning">{{
              staticsData.increased_quantity || 0
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('inventory.qty-reduced') }}:</span>
            <span class="text-warning">{{
              staticsData.reduced_quantity || 0
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('inventory.remain-qty') }}:</span>
            <span class="text-warning">{{
              staticsData.remain_quantity || 0
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('inventory.total-value-of-products-by-cost') }}:</span>
            <span class="text-warning">{{
              staticsData.stock_cost_amount || 0
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('inventory.total-value-of-products-by-selling') }}:</span>
            <span class="text-warning">{{
              staticsData.stock_selling_amount || 0
            }}</span>
          </p>
        </div>
        <ElButton type="primary" @click="getStaticsData">总计</ElButton>
      </div>
    </template>
  </Page>
</template>
