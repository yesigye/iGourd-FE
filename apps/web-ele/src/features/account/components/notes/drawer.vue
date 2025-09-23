<script setup lang="ts">
// import type {
//   AccountingNotePageModel,
//   NotesDrawerTransferData,
// } from '@@/account/types';

// import { computed, ref, unref } from 'vue';

// import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';
// import { useI18n } from '@igourd/locales';

// defineOptions({
//   name: 'NotesDrawerForm',
// });

// const { t } = useI18n();
// const [FormDrawer, { close: closeDrawer }] = useIgourdDrawer({
//   appendToMain: true,
// });

// const formData = ref<Partial<AccountingNotePageModel>>({});

// const getTitle = computed(() => {
//   const { type } = formData.value as NotesDrawerTransferData;
//   if (type === 'add') return t('account.add_note');
//   if (type === 'edit') return t('common.edit');
//   return t('common.detail');
// });

// const getBindValue = computed(() => {
//   return {
//     ...unref(formData),
//   };
// });

// const formSchema = computed(() => {
//   return {
//     accounting_note_no: {
//       type: 'string',
//       'x-decorator': 'FormItem',
//       'x-component': 'Input',
//       'x-component-props': {
//         placeholder: "{{t('account.enter_note_no')}}",
//       },
//       'x-decorator-props': {
//         label: t('account.note_no'),
//       },
//     },
//     change_type: {
//       type: 'string',
//       'x-decorator': 'FormItem',
//       'x-component': 'Select',
//       'x-component-props': {
//         placeholder: "{{t('account.select_change_type')}}",
//         options: [
//           { label: t('account.revenue'), value: 'REVENUE' },
//           { label: t('account.expenditure'), value: 'EXPENDITURE' },
//         ],
//       },
//       'x-decorator-props': {
//         label: t('account.change_type'),
//       },
//     },
//     amount: {
//       type: 'number',
//       'x-decorator': 'FormItem',
//       'x-component': 'InputNumber',
//       'x-component-props': {
//         placeholder: "{{t('account.enter_amount')}}",
//         precision: 2,
//       },
//       'x-decorator-props': {
//         label: t('account.amount'),
//       },
//     },
//     payer_name: {
//       type: 'string',
//       'x-decorator': 'FormItem',
//       'x-component': 'Input',
//       'x-component-props': {
//         placeholder: "{{t('account.enter_payer_name')}}",
//       },
//       'x-decorator-props': {
//         label: t('account.payer_name'),
//       },
//     },
//     finance_category_id: {
//       type: 'number',
//       'x-decorator': 'FormItem',
//       'x-component': 'Select',
//       'x-component-props': {
//         placeholder: "{{t('account.select_finance_category')}}",
//       },
//       'x-decorator-props': {
//         label: t('account.finance_category'),
//       },
//     },
//     trading_time: {
//       type: 'string',
//       'x-decorator': 'FormItem',
//       'x-component': 'DatePicker',
//       'x-component-props': {
//         placeholder: "{{t('account.select_trading_time')}}",
//         format: 'YYYY-MM-DD HH:mm:ss',
//         valueFormat: 'YYYY-MM-DD HH:mm:ss',
//       },
//       'x-decorator-props': {
//         label: t('account.trading_time'),
//       },
//     },
//     remark: {
//       type: 'string',
//       'x-decorator': 'FormItem',
//       'x-component': 'Input',
//       'x-component-props': {
//         type: 'textarea',
//         placeholder: "{{t('account.enter_remark')}}",
//         rows: 3,
//       },
//       'x-decorator-props': {
//         label: t('account.remark'),
//       },
//     },
//   };
// });
// const { Form } = useIgourdForm({
//   schema: formSchema.value,
// });
// const handleSuccess = () => {
//   closeDrawer();
// };

import { useNotesForm } from '@@/account/hooks';

const { Drawer, Form } = useNotesForm();
</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
