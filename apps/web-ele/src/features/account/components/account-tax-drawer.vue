<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountTaxForm } from '../hooks/use-account-tax-form';

const { Drawer, Form } = useAccountTaxForm();
</script>
