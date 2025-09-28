<script setup lang="ts">
import { ElButton, ElTooltip, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { getProductSalesStatsApi } from '@@/report/apis/sales';
import { useSalesReport } from '@@/report/hooks';

defineOptions({
  name: 'ISalesReport',
});

const { t } = useI18n();
const { Grid, gridApi, Drawer, handleEdit } = useSalesReport();
const getStaticsData = async () => {
  const res = await getProductSalesStatsApi({
    report_date: reportDate.value,
  });
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
            <span>Sales Qty:</span> <span class="text-warning">2345</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>Remain Qty:</span> <span class="text-warning">2345</span>
          </p>
          <p class="flex flex-wrap gap-2.5">
            <span>Cost Amount:</span> <span class="text-warning">2345</span>
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
            <span>Sales Amount:</span> <span class="text-warning">2345</span>
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
            <span>Gross Margin::</span> <span class="text-warning">2345</span>
          </p>
        </div>
        <ElButton type="primary" @click="getStaticsData">总计</ElButton>
      </div>
    </template>
  </Page>
</template>
