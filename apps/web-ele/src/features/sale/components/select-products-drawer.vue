<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useSelectProductsDrawer } from '../hooks/use-select-products-drawer';

const { Drawer, Form } = useSelectProductsDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>