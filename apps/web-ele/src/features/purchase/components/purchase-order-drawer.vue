<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseOrderForm } from '../hooks/use-purchase-order-form';
const { Drawer, Form } = usePurchaseOrderForm();
</script>
