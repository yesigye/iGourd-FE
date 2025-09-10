<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountForm } from './use-account-form';

const { Drawer, Form } = useAccountForm();
</script>
