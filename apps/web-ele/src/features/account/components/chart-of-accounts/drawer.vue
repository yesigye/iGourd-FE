<script lang="ts" setup>
import { useAccountForm } from '@@/account/hooks/chart-of-accounts/form-schema-account';

const { Drawer, Form } = useAccountForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
