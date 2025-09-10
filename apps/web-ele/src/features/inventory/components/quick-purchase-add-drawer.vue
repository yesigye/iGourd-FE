<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useQuickPurchaseAddDrawer } from '../hooks/use-quick-purchase-add-drawer';

const { Drawer, Form } = useQuickPurchaseAddDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>