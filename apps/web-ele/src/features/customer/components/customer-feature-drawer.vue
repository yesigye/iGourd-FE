<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useCustomerFeatureForm } from '../hooks/use-customer-feature-form';

const { Drawer, Form } = useCustomerFeatureForm();
</script>

