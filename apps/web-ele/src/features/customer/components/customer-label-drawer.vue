<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useCustomerLabelDrawer } from '../hooks/use-customer-label-drawer';

const { Drawer, Form } = useCustomerLabelDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>