<template>
  <Drawer> <Form /> </Drawer>
</template>
<script setup lang="ts">
import { useAccountNotesForm } from '../hooks/use-account-notes-form';

const { Drawer, Form } = useAccountNotesForm();
</script>
