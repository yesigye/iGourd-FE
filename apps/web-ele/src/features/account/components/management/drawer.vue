<script setup lang="ts">
import { useManagementForm } from '@@/account/hooks';

defineOptions({
  name: 'AccountDrawerForm',
});
const { Drawer, Form, schema } = useManagementForm();
</script>

<template>
  <Drawer>
    <Form :schema="schema" />
  </Drawer>
</template>
