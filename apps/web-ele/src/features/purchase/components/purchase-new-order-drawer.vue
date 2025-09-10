<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseNewOrderForm } from '../hooks/use-purchase-new-order-form';
const { Drawer, Form } = usePurchaseNewOrderForm();
</script>
