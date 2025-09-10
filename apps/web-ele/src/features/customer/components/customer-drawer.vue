<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useCustomerForm } from '../hooks/use-customer-form';

const { Drawer, Form } = useCustomerForm();
</script>