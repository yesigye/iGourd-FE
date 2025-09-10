<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountExchangeForm } from '../hooks/use-account-exchange-form';

const { Drawer, Form } = useAccountExchangeForm();
</script>
