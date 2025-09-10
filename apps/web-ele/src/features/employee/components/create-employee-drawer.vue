<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useCreateEmployeeDrawer } from '../hooks/use-create-employee-drawer';

const { Drawer, Form } = useCreateEmployeeDrawer();
</script>

<style lang="scss" scoped>
.create-employee-drawer {
  // 样式可以根据需要添加
}
</style>