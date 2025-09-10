<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useChartOfAccountsForm } from '../hooks/use-chart-of-accounts-form';

const { Drawer, Form } = useChartOfAccountsForm();
</script>
