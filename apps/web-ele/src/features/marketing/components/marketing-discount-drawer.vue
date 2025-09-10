<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useMarketingDiscountDrawer } from '../hooks/use-marketing-discount-drawer';

const { Drawer, Form } = useMarketingDiscountDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>