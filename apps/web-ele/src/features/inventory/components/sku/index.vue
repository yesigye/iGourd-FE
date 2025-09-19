<script lang="ts" setup>
import { useSkuListForm } from '@@/inventory/hooks/sku-list/form';

const { Drawer, Form } = useSkuListForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
