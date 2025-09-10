<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useCreateUnitDrawer } from '../hooks/use-create-unit-drawer';

const { Drawer, Form } = useCreateUnitDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>