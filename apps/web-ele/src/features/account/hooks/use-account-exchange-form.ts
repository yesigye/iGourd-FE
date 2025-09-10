import { useI18n } from '@igourd/locales'
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui'
import { createOrUpdateAccountExchangeApi } from '../apis'

export function useAccountExchangeForm() {
  // 表单配置
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      from_currency: {
        type: 'string',
        title: "{{t('account.fromCurrency')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectFromCurrency')}}",
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
            { label: 'JPY', value: 'JPY' },
            { label: 'CNY', value: 'CNY' },
          ],
        },
      },
      to_currency: {
        type: 'string',
        title: "{{t('account.toCurrency')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectToCurrency')}}",
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
            { label: 'JPY', value: 'JPY' },
            { label: 'CNY', value: 'CNY' },
          ],
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
      effective_date: {
        type: 'string',
        title: "{{t('account.effectiveDate')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker',
        'x-component-props': {
          placeholder: "{{t('account.pleaseSelectEffectiveDate')}}",
          type: 'date',
        },
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
      await formAPI.submit(createOrUpdateAccountExchangeApi)
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
