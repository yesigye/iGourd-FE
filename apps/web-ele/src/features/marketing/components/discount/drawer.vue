<template>
  <Drawer>
    <p>折扣表单抽屉组件</p>
  </Drawer>
</template>

<script setup lang="ts">
import { useIgourdDrawer } from '@igourd/common-ui';

defineOptions({
  name: 'DiscountDrawer',
});
const [Drawer] = useIgourdDrawer({
  appendToMain: true,
});
</script>
