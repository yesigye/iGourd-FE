<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useSelectCustomersDrawer } from '../hooks/use-select-customers-drawer';

const { Drawer, Form } = useSelectCustomersDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>