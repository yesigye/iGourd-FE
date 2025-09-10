<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { usePurchaseCustomizedForm } from '../hooks/use-purchase-customized-form';
const { Drawer, Form } = usePurchaseCustomizedForm();
</script>
