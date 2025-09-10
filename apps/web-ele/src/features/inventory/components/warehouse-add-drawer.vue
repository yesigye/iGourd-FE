<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useWarehouseAddDrawer } from '../hooks/use-warehouse-add-drawer';

const { Drawer, Form } = useWarehouseAddDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>