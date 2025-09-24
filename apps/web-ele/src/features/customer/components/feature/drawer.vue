<script setup lang="ts">
import { useCustomerFeatureForm } from '@@/customer/hooks';

const { Drawer, Form } = useCustomerFeatureForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
