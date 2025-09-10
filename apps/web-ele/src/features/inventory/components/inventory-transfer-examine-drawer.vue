<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryTransferExamineDrawer } from '../hooks/use-inventory-transfer-examine-drawer';

const { Drawer, Form } = useInventoryTransferExamineDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>