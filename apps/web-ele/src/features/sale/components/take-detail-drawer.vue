<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useTakeDetailDrawer } from '../hooks/use-take-detail-drawer';

const { Drawer, Form } = useTakeDetailDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>