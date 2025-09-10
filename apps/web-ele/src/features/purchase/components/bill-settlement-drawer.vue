<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useBillSettlementDrawer } from '../hooks/use-bill-settlement-drawer';

const { Drawer, Form } = useBillSettlementDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>