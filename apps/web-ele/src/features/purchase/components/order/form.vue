<script setup lang="ts">
import { useOrderForm } from '@@/purchase/hooks';

const { Form, Drawer } = useOrderForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
