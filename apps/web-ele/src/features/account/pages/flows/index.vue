<script setup lang="ts">
import { ElText, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { moneyFormat } from '@igourd/utils';

import { useFlows } from '@@/account/hooks';

defineOptions({
  name: 'IFlows',
});
const { t } = useI18n();
const { Grid, Drawer } = useFlows();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #source_type="{ row }">
        {{ t(`enum.accout-flows-source-types.${row.source_type}`) || '--' }}
      </template>
      <template #revenue_amount="{ row }">
        <ElText type="success">
          {{ moneyFormat(row.revenue_amount) || '--' }}
        </ElText>
      </template>
      <template #expenditure_amount="{ row }">
        <ElText type="danger">
          {{ moneyFormat(row.expenditure_amount) || '--' }}
        </ElText>
      </template>
      <template #customer_name="{ row }">
        {{ row.customer_name || '--' }}
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
