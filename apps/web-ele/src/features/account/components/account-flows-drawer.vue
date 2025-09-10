<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountFlowsForm } from '../hooks/use-account-flows-form';

const { Drawer, Form } = useAccountFlowsForm();
</script>
