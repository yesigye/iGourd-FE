<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useOrderContentDrawer } from '../hooks/use-order-content-drawer';

const { Drawer, Form } = useOrderContentDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>