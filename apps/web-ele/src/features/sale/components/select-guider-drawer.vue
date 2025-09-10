<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useSelectGuiderDrawer } from '../hooks/use-select-guider-drawer';

const { Drawer, Form } = useSelectGuiderDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>