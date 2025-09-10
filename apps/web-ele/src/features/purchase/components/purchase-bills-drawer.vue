<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseBillsForm } from '../hooks/use-purchase-bills-form';
const { Drawer, Form } = usePurchaseBillsForm();
</script>
