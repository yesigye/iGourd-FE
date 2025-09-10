<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useCustomerAccountForm } from '../hooks/use-customer-account-form';

const { Drawer, Form } = useCustomerAccountForm();
</script>

