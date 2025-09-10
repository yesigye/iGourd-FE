<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseForm } from '../hooks/use-purchase-form';
const { Drawer, Form } = usePurchaseForm();
</script>