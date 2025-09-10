import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateAccountCurrencyApi } from '../apis'

export function useAccountCurrencyForm() {
  // 表单配置
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      currency_code: {
        type: 'string',
        title: "{{t('account.currencyCode')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.currencyCode')}}",
          maxlength: 10,
        },
      },
      currency_name: {
        type: 'string',
        title: "{{t('account.currencyName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.currencyName')}}",
          maxlength: 50,
        },
      },
      symbol: {
        type: 'string',
        title: "{{t('account.symbol')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('account.symbol')}}",
          maxlength: 10,
        },
      },
      exchange_rate: {
        type: 'number',
        title: "{{t('account.exchangeRate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('account.exchangeRate')}}",
          min: 0,
          precision: 4,
        },
      },
      is_base_currency: {
        type: 'boolean',
        title: "{{t('account.isBaseCurrency')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        'x-component-props': {
          checkedText: '是',
          uncheckedText: '否',
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'exchange_rate.x-component-props.disabled': '{{$self.value}}',
                'exchange_rate.value': '{{$self.value ? 1 : $self.value}}',
              },
            },
          },
        ],
      },
      status: {
        type: 'string',
        title: "{{t('account.status')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectStatus')}}",
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ],
        },
      },
    },
  }

  const [Drawer, drawerApi] = useIgourdDrawer({
    onOpenChange(isOpen) {
      if (!isOpen) {
        formAPI.setValues(drawerApi.getData() || {})
      }
    },
    async onConfirm() {
      await formAPI.validate()
      await formAPI.submit(createOrUpdateAccountCurrencyApi)
      drawerApi.close()
    },
  })

  const { Form, formAPI } = useIgourdForm({
    scope: {},
    useI18n,
    schema: formSchema,
  })
  return { Drawer, Form }
}
