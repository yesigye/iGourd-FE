<script setup lang="ts">
import { useManagementForm } from '@@/account/hooks';

defineOptions({
  name: 'AccountDrawerForm',
});
type PropType = {
  type: 'CASH' | 'CARD';
};
const props = withDefaults(defineProps<PropType>(), {
  type: 'CASH',
});
const { Drawer, Form } = useManagementForm(props.type);
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
