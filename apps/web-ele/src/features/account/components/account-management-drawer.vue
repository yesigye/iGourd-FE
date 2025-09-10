<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountManagementForm } from '../hooks/use-account-management-form';

const { Drawer, Form } = useAccountManagementForm();
</script>
