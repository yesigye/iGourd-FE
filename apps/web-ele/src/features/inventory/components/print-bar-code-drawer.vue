<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePrintBarCodeDrawer } from '../hooks/use-print-bar-code-drawer';

const { Drawer, Form } = usePrintBarCodeDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>