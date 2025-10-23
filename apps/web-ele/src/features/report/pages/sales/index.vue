<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, ElTooltip, IgourdIcon, Page } from '@igourd/common-ui';
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
    <template #footer>
      <div
        class="flex w-full items-center justify-between border-t border-solid border-[#DCDFE6] pt-2.5"
      >
        <div class="flex flex-wrap gap-2.5">
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
              :content="t('sales.sales-gross-margin-amount')"
              placement="top-start"
            >
              <IgourdIcon
                icon="bitcoin-icons:question-circle-outline"
                class="text-base"
              />
            </ElTooltip>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('sales.sales-amount') }}:</span>
            <span class="text-warning">{{ staticsData.sale_amount || 0 }}</span>
            <ElTooltip
              class="box-item"
              effect="dark"
              :content="t('sales.sales-gross-margin-rate-amount')"
              placement="top-start"
            >
              <IgourdIcon
                icon="bitcoin-icons:question-circle-outline"
                class="text-base"
              />
            </ElTooltip>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('sales.sales-gross-margin-rate') }}:</span>
            <span class="text-warning">{{
              staticsData.gross_margin_amount || 0
            }}</span>
          </p>
        </div>
        <ElButton type="primary" @click="getStaticsData">
          {{ t('sales.total') }}
        </ElButton>
      </div>
    </template>
  </Page>
</template>
