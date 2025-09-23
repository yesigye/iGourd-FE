<script lang="tsx" setup>
import { useSpoilageForm } from '@@/inventory/hooks/spoilage/form';

const { Drawer, Form } = useSpoilageForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
