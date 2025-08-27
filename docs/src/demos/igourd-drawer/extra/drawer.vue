<script lang="ts" setup>
import { useIgourdDrawer } from '@igourd/common-ui';

const [Drawer] = useIgourdDrawer();
</script>
<template>
  <Drawer title="组件抽离示例"> extra drawer content </Drawer>
</template>
