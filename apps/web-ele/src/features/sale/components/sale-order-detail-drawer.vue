<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useSaleOrderDetailDrawer } from '../hooks/use-sale-order-detail-drawer';

const { Drawer, Form } = useSaleOrderDetailDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>