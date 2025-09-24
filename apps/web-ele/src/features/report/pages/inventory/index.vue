<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useInventoryReport } from '@@/report/hooks';

defineOptions({
  name: 'IInventoryReport',
});

const { t } = useI18n();
const { Grid, Drawer } = useInventoryReport();
</script>

<template>
  <Page auto-content-height>
    <Grid>
    </Grid>
    <Drawer />
  </Page>
</template>
