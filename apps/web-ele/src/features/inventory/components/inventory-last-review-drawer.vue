<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryLastReviewDrawer } from '../hooks/use-inventory-last-review-drawer';

const { Drawer, Form } = useInventoryLastReviewDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>