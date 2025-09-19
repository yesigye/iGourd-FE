<script lang="ts" setup>
import { useWarehouseForm } from '@@/inventory/hooks/warehouse/form';

const { Drawer, Form } = useWarehouseForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
