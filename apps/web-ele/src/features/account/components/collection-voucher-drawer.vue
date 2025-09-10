<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useCollectionVoucherForm } from '../hooks/use-collection-voucher-form';

const { Drawer, Form } = useCollectionVoucherForm();
</script>
