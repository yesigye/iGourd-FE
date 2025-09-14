<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useListForm } from '@@/purchase/hooks';
const { Drawer, Form } = useListForm();
</script>
