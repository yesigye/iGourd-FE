<script setup lang="ts">
import type { AccountPageModel, DrawerTransferData } from '@@/account/types';

import { computed, ref, unref } from 'vue';

import { Form, useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

defineOptions({
  name: 'AccountDrawerForm',
});

const { t } = useI18n();
const [FormDrawer, { close: closeDrawer }] = useIgourdDrawer();

const formRef = ref();
const formData = ref<Partial<AccountPageModel>>({});

const getTitle = computed(() => {
  const { drawerType } = formData.value as DrawerTransferData;
  if (drawerType === 'add') return t('account.add_cash');
  if (drawerType === 'edit') return t('common.edit');
  return t('common.detail');
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
        placeholder: "{{t('account.enter_account_code')}}",
      },
      'x-decorator-props': {
        label: t('account.account_code'),
      },
    },
    name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('account.enter_account_name')}}",
      },
      'x-decorator-props': {
        label: t('account.account_name'),
      },
    },
    account_type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: "{{t('account.select_account_type')}}",
        options: [
          { label: t('account.cash'), value: 'CASH' },
          { label: t('account.bank'), value: 'CARD' },
        ],
      },
      'x-decorator-props': {
        label: t('account.account_type'),
      },
    },
    bank_name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('account.enter_bank_name')}}",
      },
      'x-decorator-props': {
        label: t('account.bank_name'),
      },
    },
    bank_account_number: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('account.enter_bank_account')}}",
      },
      'x-decorator-props': {
        label: t('account.bank_account'),
      },
    },
    initial_balance: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {
        placeholder: "{{t('account.enter_initial_balance')}}",
        precision: 2,
      },
      'x-decorator-props': {
        label: t('account.initial_balance'),
      },
    },
    current_balance: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {
        placeholder: "{{t('account.enter_current_balance')}}",
        precision: 2,
      },
      'x-decorator-props': {
        label: t('account.current_balance'),
      },
    },
    remark: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        type: 'textarea',
        placeholder: "{{t('account.enter_remark')}}",
        rows: 3,
      },
      'x-decorator-props': {
        label: t('account.remark'),
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
const openDrawer = (open: boolean, data?: DrawerTransferData) => {
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

<template>
  <FormDrawer v-bind="getBindValue" :title="getTitle">
    <Form
      ref="formRef"
      :schema="formSchema"
      :label-width="100"
      @submit="handleSubmit"
    />
  </FormDrawer>
</template>
