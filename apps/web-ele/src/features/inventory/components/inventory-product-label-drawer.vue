<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryProductLabelForm } from '../hooks/use-inventory-product-label-form';

const { Drawer, Form } = useInventoryProductLabelForm();
</script>