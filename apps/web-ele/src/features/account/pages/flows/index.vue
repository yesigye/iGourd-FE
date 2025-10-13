<script setup lang="ts">
import { Page } from '@igourd/common-ui';

import { useFlows } from '@@/account/hooks';

defineOptions({
  name: 'IFlows',
});

const { Grid, Drawer } = useFlows();
</script>

<template>
  <Page auto-content-height>
    <Grid />
    <Drawer />
  </Page>
</template>
