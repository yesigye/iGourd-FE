<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryTransferAuditDrawer } from '../hooks/use-inventory-transfer-audit-drawer';

const { Drawer, Form } = useInventoryTransferAuditDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>