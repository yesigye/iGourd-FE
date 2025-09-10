<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseBillsAddDrawer } from '../hooks/use-purchase-bills-add-drawer';

const { Drawer, Form } = usePurchaseBillsAddDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>