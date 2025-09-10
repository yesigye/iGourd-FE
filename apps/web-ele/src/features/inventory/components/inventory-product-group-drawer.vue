<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryProductGroupForm } from '../hooks/use-inventory-product-group-form';

const { Drawer, Form } = useInventoryProductGroupForm();
</script>