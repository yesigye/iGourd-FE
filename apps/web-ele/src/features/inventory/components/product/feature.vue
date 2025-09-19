<script lang="ts" setup>
import { useFeatureForm } from '@@/inventory/hooks/product-feature/form';

const { Drawer, Form } = useFeatureForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
