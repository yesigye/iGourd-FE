<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

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
    </Grid>
    <Drawer />
  </Page>
</template>
