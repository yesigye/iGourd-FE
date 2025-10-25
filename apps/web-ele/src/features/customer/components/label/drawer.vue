<script setup lang="ts">
import { useI18n } from '@igourd/locales';

import { useCustomerlabelForm } from '@@/customer/hooks/label';

const { t } = useI18n();
const { Drawer, drawerApi, Form } = useCustomerlabelForm({
  title: t('label.add-label'),
  class: 'w-3/4',
});
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
