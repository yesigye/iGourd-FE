<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePrintOrderDetailDrawer } from '../hooks/use-print-order-detail-drawer';

const { Drawer, Form } = usePrintOrderDetailDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>