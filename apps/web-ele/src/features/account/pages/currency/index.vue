<template>
  <Page auto-content-height>
    <Grid>
    </Grid>
    <Drawer />
  </Page>
</template>

<script setup lang="ts">
import { ElButton, Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useCurrency } from '@@/account/hooks';

defineOptions({
  name: 'ICurrency',
});

const { t } = useI18n();

const { Grid, Drawer, handleEdit, handleBatchDelete, canBatchOperate } =
  useCurrency();
</script>
