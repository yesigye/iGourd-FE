<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getInventoryStatsApi } from '@@/report/apis';
import { useInventoryReport } from '@@/report/hooks';

defineOptions({
  name: 'IInventoryReport',
});
const warehouseOptions = ref([]);

const { t } = useI18n();
const { Grid, Drawer, queryData, query } = useInventoryReport(
  warehouseOptions.value,
);
const staticsData = ref<ProductSalesStatsResponse>({});
const getStaticsData = async () => {
  const res = await getInventoryStatsApi({
    ...query.value,
  });
  staticsData.value = res || {};
};
</script>

<template>
  <Page auto-content-height>
    <Grid />
    <Drawer />
    <template #footer>
      <div
        class="flex w-full items-center justify-between border-t border-solid border-[#DCDFE6] pt-2.5"
      >
        <div class="flex flex-wrap gap-2.5">
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
