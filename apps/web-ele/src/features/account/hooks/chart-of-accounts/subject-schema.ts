import type { ISchema } from '@igourd/common-ui';

const formSchema: ISchema = {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 14,
      },
      properties: {
        category: {
          type: 'string',
          title: "{{t('chart-of-accounts.add-subject-form.ledger-type')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: '{{ categoryOptions }}',
          'x-component-props': {
            placeholder:
              "{{t('chart-of-accounts.add-subject-form.ledger-type')}}",
            clearable: true,
          },
        },
        parent_id: {
          type: 'string',
          title: "{{t('chart-of-accounts.add-subject-form.parent-ledger')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: '{{ parentOptions.value }}',
          'x-component-props': {
            placeholder:
              "{{t('chart-of-accounts.add-subject-form.parent-ledger')}}",
            clearable: true,
          },
        },
        code: {
          type: 'string',
          title: "{{t('chart-of-accounts.add-account-form.code')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: "{{t('chart-of-accounts.add-account-form.code')}}",
            clearable: true,
          },
        },
        name: {
          type: 'string',
          title: "{{t('chart-of-accounts.add-account-form.name')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: "{{t('chart-of-accounts.add-account-form.name')}}",
            clearable: true,
          },
        },
        balance_direction: {
          type: 'string',
          required: true,
          'x-decorator': 'FormItem',
          title: "{{t('chart-of-accounts.add-subject-form.account-status')}}",
          'x-component': 'Select',
          enum: '{{ blanceDirectionOptions }}',
        },
        is_enabled: {
          type: 'string',
          title: "{{t('chart-of-accounts.add-subject-form.account-status')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-component-props': {
            placeholder:
              "{{t('chart-of-accounts.add-subject-form.account-status')}}",
            clearable: true,
          },
        },
        features_type: {
          type: 'string',
          title: "{{t('chart-of-accounts.add-subject-form.account-type')}}",
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox.Group',
          enum: [
            {
              label: `{{ t('chart-of-accounts.add-subject-form.quantity-accounting') }}`,
              value: 'QTY',
            },
            {
              label: `{{ t('chart-of-accounts.add-subject-form.auxiliary-accounting') }}`,
              value: 'AUX',
            },
            {
              label: `{{ t('chart-of-accounts.add-subject-form.foreign-currency-accounting')}}`,
              value: 'FOREIGN',
            },
          ],
          'x-component-props': {
            placeholder:
              "{{t('chart-of-accounts.add-subject-form.account-type')}}",
            clearable: true,
          },
        },
      },
    },
  },
};
export default formSchema;
