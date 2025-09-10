<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useScanCashSettlementDrawer } from '../hooks/use-scan-cash-settlement-drawer';

const { Drawer, Form } = useScanCashSettlementDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>