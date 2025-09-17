<template>
  <Drawer />
</template>
<script setup lang="ts">
import { useIgourdDrawer } from '@igourd/common-ui';
const [Drawer] = useIgourdDrawer({
  appendToMain: true,
});
</script>
