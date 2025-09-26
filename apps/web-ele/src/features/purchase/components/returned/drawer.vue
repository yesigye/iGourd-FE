<script setup lang="ts">
import { useReturnForm } from '@@/purchase/hooks';

const { Form, Drawer } = useReturnForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
