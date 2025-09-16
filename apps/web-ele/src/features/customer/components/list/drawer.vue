<template>
  <FormDrawer v-bind="getBindValue" :title="getTitle" @success="handleSuccess">
    <Form
      ref="formRef"
      :schema="formSchema"
      :label-width="100"
      @submit="handleSubmit"
    />
  </FormDrawer>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue';
import { Form, useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import type {
  CustomerInfo,
  CustomerDrawerTransferData,
} from '@@/customer/types';

import { useDrawer } from '#/hooks';

defineOptions({
  name: 'CustomerDrawerForm',
});

const { t } = useI18n();
const [FormDrawer, { close: closeDrawer }] = useIgourdDrawer();

const formRef = ref();
const formData = ref<Partial<CustomerInfo>>({});

const getTitle = computed(() => {
  const { type } = formData.value as CustomerDrawerTransferData;
  if (type === 'add') return t('customer.addCustomer');
  if (type === 'edit') return t('customer.editCustomer');
  return t('customer.customerDetail');
});

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

const handleSuccess = () => {
  closeDrawer();
};

const handleSubmit = async (values: any) => {
  console.log('Form values:', values);
  // 这里处理表单提交逻辑
  handleSuccess();
};

// 暴露给父组件的方法
const openDrawer = (open: boolean, data?: CustomerDrawerTransferData) => {
  if (open) {
    formData.value = data || {};
    setDrawerProps({ open });
  } else {
    closeDrawer();
  }
};

defineExpose({
  openDrawer,
});
</script>
