<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useInventoryChangeLogList } from '../../hooks/use-inventory-change-log-list';

defineOptions({
  name: 'IInventoryChangeLog',
});

const { Grid } = useInventoryChangeLogList();
</script>

