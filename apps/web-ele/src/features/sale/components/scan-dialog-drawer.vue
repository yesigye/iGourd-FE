<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useScanDialogDrawer } from '../hooks/use-scan-dialog-drawer';

const { Drawer, Form } = useScanDialogDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>