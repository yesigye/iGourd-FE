<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script setup lang="ts">
import { useInventoryProductFeatureForm } from '../hooks/use-inventory-product-feature-form';

const { Drawer, Form } = useInventoryProductFeatureForm();
</script>