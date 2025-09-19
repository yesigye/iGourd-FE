<script setup lang="ts">
import { useListForm } from '@@/purchase/hooks';

const { Drawer, Form } = useListForm();
</script>

<template>
  <Drawer>
    <!-- 采购列表表单抽屉组件 -->
    <Form />
  </Drawer>
</template>
