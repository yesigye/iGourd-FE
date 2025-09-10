import { useIgourdForm, type ISchema } from '@igourd/common-ui';
import { customerApi } from '../apis';

export function useCustomerIntegralForm() {

  const formSchema: ISchema = {
    type: 'object',
    properties: {
      basicSettings: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.integralsetting')}}",
          defaultOpen: true,
        },
        properties: {
          initial_points: {
            type: 'number',
            title: "{{t('customers.initialearnedintegral')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseenterofficialwebsite')}}",
              min: 0,
              style: { width: '100%' },
              addonAfter: "{{t('customers.points')}}",
            },
          },
          exchange_rate: {
            type: 'number',
            title: "{{t('customers.everyconsumption')}}",
            required: true,
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'InputNumber',
            'x-component-props': {
              placeholder: "{{t('customers.pleaseenterdeductionrate')}}",
              min: 0,
              precision: 2,
              style: { width: '100%' },
              addonAfter: "{{t('customers.cash')}}",
            },
          },
        },
      },
      exchangeRules: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.pointredemptionrule')}}",
          defaultOpen: true,
        },
        properties: {
          point_exchange_type: {
            type: 'string',
            title: "{{t('customers.exchangemode')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Radio.Group',
            'x-component-props': {
              options: [
                { label: "{{t('customers.redeem')}}", value: 'EXCHANGE_GIFTS' },
              ],
            },
          },
        },
      },
      otherSettings: {
        type: 'void',
        'x-component': 'FormCollapse',
        'x-component-props': {
          title: "{{t('customers.otherSettings')}}",
          defaultOpen: true,
        },
        properties: {
          is_annually_resettable: {
            type: 'boolean',
            title: "{{t('customers.everyyearonjanuary1resetpointstozero')}}",
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 'span 2',
            },
            'x-component': 'Switch',
            'x-component-props': {
              checkedText: '{{ t("common.yes") }}',
              uncheckedText: '{{ t("common.no") }}',
            },
          },
        },
      },
    },
  };

  const { Form, formAPI } = useIgourdForm({
    schema: formSchema,
    onSubmit: async (values) => {
      try {
        await customerApi.updateIntegralSettings(values);
        // 显示成功消息
        console.log('积分设置保存成功');
      } catch (error) {
        console.error('保存失败:', error);
      }
    },
  });

  return {
    Form,
    formAPI,
  };
}
