<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useEditEmployeeDrawer } from '../hooks/use-edit-employee-drawer';

const { Drawer, Form } = useEditEmployeeDrawer();
</script>

<style lang="scss" scoped>
.edit-employee-drawer {
  // 样式可以根据需要添加
}
</style>