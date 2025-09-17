<template>
  <Drawer />
</template>
<script lang="ts" setup>
import { useIgourdDrawer } from '@igourd/common-ui';

const [Drawer] = useIgourdDrawer({
  appendToMain: true,
});
</script>
