<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventorySpoilageAddDrawer } from '../hooks/use-inventory-spoilage-add-drawer';

const { Drawer, Form } = useInventorySpoilageAddDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>