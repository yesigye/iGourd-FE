<script lang="ts" setup>
import { useCountForm } from '@@/inventory/hooks/count/form';

const { Drawer, Form } = useCountForm();
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
