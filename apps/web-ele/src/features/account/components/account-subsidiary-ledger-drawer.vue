<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountSubsidiaryLedgerForm } from '../hooks/use-account-subsidiary-ledger-form';

const { Drawer, Form } = useAccountSubsidiaryLedgerForm();
</script>
