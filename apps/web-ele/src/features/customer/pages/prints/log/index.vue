<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@igourd/common-ui';

import { useIntegralLogList } from '@@/customer/hooks';

defineOptions({
  name: 'IIntegralLogList',
});

const { Grid } = useIntegralLogList();
</script>
