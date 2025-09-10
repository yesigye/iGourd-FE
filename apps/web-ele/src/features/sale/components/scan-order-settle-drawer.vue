<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useScanOrderSettleDrawer } from '../hooks/use-scan-order-settle-drawer';

const { Drawer, Form } = useScanOrderSettleDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>