<script setup lang="ts">
import { useClassificationForm } from '@@/account/hooks';

const { Drawer, Form } = useClassificationForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
