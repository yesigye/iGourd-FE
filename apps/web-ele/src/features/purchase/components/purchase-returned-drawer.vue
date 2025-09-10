<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseReturnedForm } from '../hooks/use-purchase-returned-form';
const { Drawer, Form } = usePurchaseReturnedForm();
</script>
