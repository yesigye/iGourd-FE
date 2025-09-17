<script setup lang="ts">
import { Page } from '@igourd/common-ui';

import { useInventoryProductSpec } from '@@/inventory/hooks';

defineOptions({
  name: 'IInventoryProductSpec',
});

const { Grid } = useInventoryProductSpec();
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
