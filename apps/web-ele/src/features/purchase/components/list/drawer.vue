<template>
  <Drawer>
    <!-- 采购列表表单抽屉组件 -->
    <p>采购列表表单抽屉组件</p>
  </Drawer>
</template>

<script setup lang="ts">
import { useIgourdDrawer } from '@igourd/common-ui';

defineOptions({
  name: 'PurchaseListDrawer',
});
const [Drawer] = useIgourdDrawer({
  appendToMain: true,
});
</script>
