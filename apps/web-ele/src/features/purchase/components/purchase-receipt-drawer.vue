<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseReceiptForm } from '../hooks/use-purchase-receipt-form';
const { Drawer, Form } = usePurchaseReceiptForm();
</script>
