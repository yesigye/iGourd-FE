<script setup lang="ts">
import { Page } from '@igourd/common-ui';

import { useSaleShifts } from '@@/sale/hooks';

defineOptions({
  name: 'ISaleShifts',
});

const { Grid } = useSaleShifts();
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
