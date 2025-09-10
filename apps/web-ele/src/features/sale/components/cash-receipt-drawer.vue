<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useCashReceiptDrawer } from '../hooks/use-cash-receipt-drawer';

const { Drawer, Form } = useCashReceiptDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>