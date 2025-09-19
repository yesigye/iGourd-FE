<script lang="ts" setup>
// import { useGroupForm } from '@@/inventory/hooks/product-group/form';
import { useUnitForm } from '@@/inventory/hooks/unit/form';

const { Drawer, Form } = useUnitForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
