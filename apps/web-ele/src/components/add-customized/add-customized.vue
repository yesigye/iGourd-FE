<script setup lang="ts">
import { useAddCustomizedForm } from '#/hooks/use-add-customized';

const { Drawer, Form } = useAddCustomizedForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
