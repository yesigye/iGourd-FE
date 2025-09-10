<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePrintOrderReceiptDrawer } from '../hooks/use-print-order-receipt-drawer';

const { Drawer, Form } = usePrintOrderReceiptDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>