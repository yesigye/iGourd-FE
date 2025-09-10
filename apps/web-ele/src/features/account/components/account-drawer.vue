<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountForm } from '../hooks/use-account-form';

const { Drawer, Form } = useAccountForm();
</script>
