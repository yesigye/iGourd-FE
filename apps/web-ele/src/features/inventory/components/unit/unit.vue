<script lang="ts" setup>
import { useUnitForm } from '@@/inventory/hooks/unit/form';

const { Drawer, Form } = useUnitForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
