<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useReturnedTotalSettlementDrawer } from '../hooks/use-returned-total-settlement-drawer';

const { Drawer, Form } = useReturnedTotalSettlementDrawer();
</script>

<style lang="scss" scoped>
// 样式可以根据需要添加
</style>