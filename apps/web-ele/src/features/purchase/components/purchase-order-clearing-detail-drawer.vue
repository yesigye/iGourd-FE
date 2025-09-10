<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseOrderClearingDetailDrawer } from '../hooks/use-purchase-order-clearing-detail-drawer';

const { Drawer, Form } = usePurchaseOrderClearingDetailDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>