<script setup lang="ts">
import { useExchangeForm } from '@@/account/hooks';

const { Drawer, Form } = useExchangeForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
