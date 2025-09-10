<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useRefundOrderDrawer } from '../hooks/use-refund-order-drawer';

const { Drawer, Form } = useRefundOrderDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>