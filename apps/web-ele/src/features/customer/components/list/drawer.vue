<script setup lang="ts">
import { useCustomerListForm } from '@@/customer/hooks';

const { Drawer, Form } = useCustomerListForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
