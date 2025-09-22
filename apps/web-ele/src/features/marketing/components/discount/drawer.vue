<script setup lang="ts">
import { useDiscountForm } from '../../hooks';

defineOptions({
  name: 'DiscountDrawer',
});
const { Drawer, Form } = useDiscountForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
