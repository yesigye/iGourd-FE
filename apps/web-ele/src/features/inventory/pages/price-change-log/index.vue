<script setup lang="ts">
import { Page } from '@igourd/common-ui';

import { useInventoryPriceLogList } from '@@/inventory/hooks';

defineOptions({
  name: 'IInventoryPriceLog',
});

const { Grid } = useInventoryPriceLogList();
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
