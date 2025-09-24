<script setup lang="ts">
import { useNotesForm } from '@@/account/hooks';

const { Drawer, Form } = useNotesForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
