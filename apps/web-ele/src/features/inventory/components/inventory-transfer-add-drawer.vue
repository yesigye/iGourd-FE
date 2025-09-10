<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryTransferAddDrawer } from '../hooks/use-inventory-transfer-add-drawer';

const { Drawer, Form } = useInventoryTransferAddDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>