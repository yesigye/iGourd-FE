<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseOrderAddDrawer } from '../hooks/use-purchase-order-add-drawer';

const { Drawer, Form } = usePurchaseOrderAddDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>