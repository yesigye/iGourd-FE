<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useCheckBoxModalDrawer } from '../hooks/use-check-box-modal-drawer';

const { Drawer, Form } = useCheckBoxModalDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>