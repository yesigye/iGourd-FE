<template>
  <Drawer />
</template>
<script lang="tsx" setup>
import { useIgourdDrawer } from '@igourd/common-ui';

const [Drawer] = useIgourdDrawer({
  appendToMain: true,
});
</script>
