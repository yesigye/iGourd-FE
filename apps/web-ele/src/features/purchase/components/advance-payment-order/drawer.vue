<script setup lang="ts">
import { useAdvancePaymentOrderForm } from '@@/purchase/hooks';

const { Drawer, Form } = useAdvancePaymentOrderForm({
  business_type: 'SALES_ORDER',
});
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
