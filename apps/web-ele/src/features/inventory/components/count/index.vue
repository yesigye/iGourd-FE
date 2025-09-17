<script lang="ts" setup>
import { useIgourdDrawer } from '@igourd/common-ui';

const [Drawer, drawerApi] = useIgourdDrawer({
  appendToMain: true,
});
</script>
<template>
  <Drawer> dd </Drawer>
</template>
