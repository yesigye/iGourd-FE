<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryCountDetailDrawer } from '../hooks/use-inventory-count-detail-drawer';

const { Drawer, Form } = useInventoryCountDetailDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>