<script lang="ts" setup>
import { useGroupForm } from '@@/inventory/hooks/product-group/form';

const { Drawer, Form } = useGroupForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
