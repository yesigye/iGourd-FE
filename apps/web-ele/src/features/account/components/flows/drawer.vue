<template>
  <Drawer> ddd </Drawer>
</template>
<script setup lang="ts">
import { useIgourdDrawer } from '@igourd/common-ui';

const [Drawer, drawerApi] = useIgourdDrawer({
  appendToMain: true,
});
</script>
