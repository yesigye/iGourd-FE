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
    <Grid>
      <template #printContent="{ options }"> 自定义按dsss钮1 </template>
    </Grid>
    <Drawer />
  </Page>
</template>
