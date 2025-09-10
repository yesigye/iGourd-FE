<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<script lang="ts" setup>
import { useI18n } from '@igourd/locales';
import { useCustomerDetailForm } from '@@/customer/hooks/use-customer-detail-form';
import { useIgourdDrawer } from '@igourd/common-ui';

const { t } = useI18n();

const { Form, formAPI } = useCustomerDetailForm();
const [Drawer, drawerApi] = useIgourdDrawer({
  appendToMain: true,
  submitting: false,
  class: 'w-[1000px]',
  title: "{{t('customer.customerDetail')}}",
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formAPI.setValues(drawerApi.getData<Record<string, any>>());
    }
  },
  openAutoFocus: true,
  showConfirm: false,
  showCancel: false,
});
</script>
