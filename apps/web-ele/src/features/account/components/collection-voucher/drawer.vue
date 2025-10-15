<script setup lang="ts">
import { useCollectionVoucherForm } from '@@/account/hooks';

const { Drawer, Form } = useCollectionVoucherForm({
  business_type: 'SALES_ORDER',
});
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
