<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryProductAddForm } from '../hooks/use-inventory-product-add-form';
const { Drawer, Form } = useInventoryProductAddForm();
</script>
