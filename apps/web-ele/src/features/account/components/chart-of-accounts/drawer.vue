<script lang="ts" setup>
import { useChartOfAccountsForm } from '@@/account/hooks';
import type { IChatOfAccountProps } from '.';

const props = withDefaults(defineProps<IChatOfAccountProps>(), {
  type: 'ledger',
});
const { Drawer, Form, schema } = useChartOfAccountsForm(props);
</script>
<template>
  <Drawer>
    <Form :schema="schema" />
  </Drawer>
</template>
