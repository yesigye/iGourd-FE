<script setup lang="ts">
import { useIgourdDrawer } from '@igourd/common-ui';

defineOptions({
  name: 'PurchaseBillDrawer',
});
const [Drawer] = useIgourdDrawer({
  appendToMain: true,
  class: 'w-full',
});
</script>

<template>
  <Drawer>
    <!-- 采购单表单抽屉组件 -->
    <p>采购单表单抽屉组件</p>
  </Drawer>
</template>
