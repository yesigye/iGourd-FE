<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useProductImportDrawer } from '../hooks/use-product-import-drawer';

const { Drawer, Form } = useProductImportDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>