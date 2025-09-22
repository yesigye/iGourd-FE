<script setup lang="ts">
import { usePriceForm } from '../../hooks';

defineOptions({
  name: 'DiscountDrawer',
});
const { Drawer, Form } = usePriceForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
