<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryProductsDetailDrawer } from '../hooks/use-inventory-products-detail-drawer';

const { Drawer, Form } = useInventoryProductsDetailDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>