<script lang="tsx" setup>
import { useTransferForm } from '@@/inventory/hooks/transfer/form';

const { Drawer, Form } = useTransferForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
