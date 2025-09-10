<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseOrderClearingDrawer } from '../hooks/use-purchase-order-clearing-drawer';

const { Drawer, Form } = usePurchaseOrderClearingDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>