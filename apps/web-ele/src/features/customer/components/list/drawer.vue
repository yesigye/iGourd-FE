<script setup lang="ts">
import type { CustomerInfo } from '@@/customer/types';

import { computed, ref, unref } from 'vue';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

defineOptions({
  name: 'CustomerDrawerForm',
});

const { t } = useI18n();
const [FormDrawer] = useIgourdDrawer({
  title: t('customer.addCustomer'),
});

const formData = ref<Partial<CustomerInfo>>({});

const getBindValue = computed(() => {
  return {
    ...unref(formData),
  };
});

const formSchema = computed(() => {
  return {
    code: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('customer.enter_customer_code')}}",
      },
      'x-decorator-props': {
        label: t('customer.customer_code'),
      },
    },
    name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('customer.enter_customer_name')}}",
      },
      'x-decorator-props': {
        label: t('customer.customer_name'),
      },
    },
    phone_number: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('customer.enter_phone_number')}}",
      },
      'x-decorator-props': {
        label: t('customer.phone_number'),
      },
    },
    email: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('customer.enter_email')}}",
        type: 'email',
      },
      'x-decorator-props': {
        label: t('customer.email'),
      },
    },
    address: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        type: 'textarea',
        placeholder: "{{t('customer.enter_address')}}",
        rows: 3,
      },
      'x-decorator-props': {
        label: t('customer.address'),
      },
    },
    gender: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('customer.select_gender')}}",
        options: [
          { label: t('customer.male'), value: 'MALE' },
          { label: t('customer.female'), value: 'FEMALE' },
          { label: t('customer.unknown'), value: 'UNKNOWN' },
        ],
      },
      'x-decorator-props': {
        label: t('customer.gender'),
      },
    },
    birthday: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker',
      'x-component-props': {
        placeholder: "{{t('customer.select_birthday')}}",
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      'x-decorator-props': {
        label: t('customer.birthday'),
      },
    },
    remark: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        type: 'textarea',
        placeholder: "{{t('customer.enter_remark')}}",
        rows: 3,
      },
      'x-decorator-props': {
        label: t('customer.remark'),
      },
    },
  };
});
const { Form } = useIgourdForm({
  schema: formSchema.value,
});
</script>

<template>
  <FormDrawer v-bind="getBindValue" :title="getTitle">
    <Form />
  </FormDrawer>
</template>
