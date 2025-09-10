<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseNewOrderHistoryForm } from '../hooks/use-purchase-new-order-history-form';
const { Drawer, Form } = usePurchaseNewOrderHistoryForm();
</script>
