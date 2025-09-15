<script setup lang="ts">
import { useCustomizedForm } from '@@/purchase/hooks';

const { Drawer, Form } = useCustomizedForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
