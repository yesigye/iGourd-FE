<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountFinalTransferForm } from '../hooks/use-account-final-transfer-form';

const { Drawer, Form } = useAccountFinalTransferForm();
</script>
