<script setup lang="ts">
import { useReceiptForm } from '@@/purchase/hooks';

const { Form, Drawer } = useReceiptForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
