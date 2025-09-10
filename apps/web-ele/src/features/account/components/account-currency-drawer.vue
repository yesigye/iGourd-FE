<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountCurrencyForm } from '../hooks/use-account-currency-form';

const { Drawer, Form } = useAccountCurrencyForm();
</script>
