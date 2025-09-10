<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script lang="ts" setup>
import { useI18n } from '@igourd/locales';
import { useEmployeeForm } from '@@/employee/hooks/use-employee-form';
import { useIgourdDrawer } from '@igourd/common-ui';

const { t } = useI18n();

/**
 * 此处传入 scope 参数。
 */
const { Form, formAPI, handleSubmit } = useEmployeeForm();
const [Drawer, drawerApi] = useIgourdDrawer({
  appendToMain: true,
  submitting: false,
  class: 'w-[600px]',
  title: "{{t('employee.title')}}",
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formAPI.setValues(drawerApi.getData<Record<string, any>>());
    }
  },
  openAutoFocus: true,
  async onConfirm() {
    const success = await handleSubmit();
    if (success) {
      await drawerApi.close();
      formAPI.reset();
    }
  },
});
</script>
