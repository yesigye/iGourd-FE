<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useEditSkuDetailsDrawer } from '../hooks/use-edit-sku-details-drawer';

const { Drawer, Form } = useEditSkuDetailsDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>