<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSalesReport } from '@@/report/hooks';

defineOptions({
  name: 'ISalesReport',
});

const { t } = useI18n();
const { Grid, Drawer,handleEdit } = useSalesReport();
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
  </Page>
</template>
