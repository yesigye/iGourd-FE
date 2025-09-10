<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useReturnOrderDetailsDrawer } from '../hooks/use-return-order-details-drawer';

const { Drawer, Form } = useReturnOrderDetailsDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>