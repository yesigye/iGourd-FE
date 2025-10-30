<script setup lang="ts">
import { ref } from 'vue';

import { ElButton, ElText, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getFinancialStatsApi } from '@@/report/apis';
import { useFinancialReport } from '@@/report/hooks';

defineOptions({
  name: 'IFinancialReport',
});
const { t } = useI18n();
const { Grid, Drawer, queryData, query } = useFinancialReport();
const staticsData = ref({});
const getStaticsData = async () => {
  const res = await getFinancialStatsApi({
    ...query.value,
  });
  staticsData.value = res || {};
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-actions>
        <ElButton type="primary">
          {{ t('report.exportReport') }}
        </ElButton>
      </template>
      <template #revenue_amount="{ row }">
        <ElText type="success">{{ row.revenue_amount || '--' }}</ElText>
      </template>
      <template #expendityre_amount="{ row }">
        <ElText type="danger">{{ row.expendityre_amount || '--' }}</ElText>
      </template>
    </Grid>
    <Drawer />
    <template #footer>
      <div
        class="flex w-full items-center justify-between border-t border-solid border-[#DCDFE6] pt-2.5"
      >
        <div class="flex flex-wrap gap-2.5">
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('financial.revenue') }}:</span>
            <span class="text-success">+{{ staticsData.revenue_amount || 0 }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('financial.expenditure') }}:</span>
            <span class="text-[#F56C6C]">-{{ staticsData.advances_received_amount || 0 }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('financial.cash-balance') }}:</span>
            <span class="text-warning">{{
              staticsData.customer_debt_amount || 0
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('financial.bank-balance') }}:</span>
            <span class="text-warning">{{
              staticsData.customer_debt_amount || 0
            }}</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>{{ t('financial.gross-profit') }}:</span>
            <span class="text-warning">{{
              staticsData.gross_profit_amount || 0
            }}</span>
          </p>
        </div>
        <ElButton type="primary" @click="getStaticsData">总计</ElButton>
      </div>
    </template>
  </Page>
</template>
