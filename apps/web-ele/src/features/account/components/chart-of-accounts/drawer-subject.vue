<script lang="ts" setup>
import { useSubjectForm } from '@@/account/hooks/chart-of-accounts/form-schema-subject';

const { Drawer, Form } = useSubjectForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
