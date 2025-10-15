<script setup lang="ts">
import { useCollectionVoucherForm } from '@@/account/hooks';

const { Drawer, Form } = useCollectionVoucherForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
