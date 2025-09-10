<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useInventoryPriceLogList } from '../../hooks/use-inventory-price-log-list';

defineOptions({
  name: 'IInventoryPriceLog',
});

const { Grid } = useInventoryPriceLogList();
</script>

