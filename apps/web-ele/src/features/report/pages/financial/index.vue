<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useFinancialReport } from '@@/report/hooks';

defineOptions({
  name: 'IFinancialReport',
});

const { t } = useI18n();
const { Grid, Drawer } = useFinancialReport();
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #table-title>
        <ElButton type="primary">
          {{ t('report.exportReport') }}
        </ElButton>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>
