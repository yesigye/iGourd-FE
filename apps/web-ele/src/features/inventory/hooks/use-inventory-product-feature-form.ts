import { useI18n } from '@igourd/locales';
import { useIgourdForm, useIgourdDrawer } from '@igourd/common-ui';
import type { ISchema } from '@igourd/common-ui';
import { inventoryApi } from '../apis';

export function useInventoryProductFeatureForm() {
  const { t } = useI18n();

  const formSchema: ISchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: "{{t('inventory.featureName')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('inventory.pleaseEnterFeatureName')}}",
          maxlength: 80,
          showWordLimit: true,
        },
      },
      type: {
        type: 'string',
        title: "{{t('inventory.featureType')}}",
        required: true,
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Radio.Group',
        'x-component-props': {
          options: [
            { label: "{{t('inventory.textType')}}", value: 'TEXT' },
            { label: "{{t('inventory.selectType')}}", value: 'SELECT' },
            { label: "{{t('inventory.numberType')}}", value: 'NUMBER' },
            { label: "{{t('inventory.dateType')}}", value: 'DATE' },
          ],
        },
        'x-reactions': [
          {
            dependencies: ['.'],
            fulfill: {
              state: {
                'is_fixed_option.visible': '{{$self.value === "SELECT"}}',
                'max_length.visible': '{{$self.value === "TEXT"}}',
              },
            },
          },
        ],
      },
      is_compulsory: {
        type: 'boolean',
        title: "{{t('inventory.isCompulsory')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Radio.Group',
        'x-component-props': {
          options: [
            { label: "{{t('marketing.yes')}}", value: true },
            { label: "{{t('marketing.no')}}", value: false },
          ],
        },
      },
      is_fixed_option: {
        type: 'boolean',
        title: "{{t('purchase.isFixedOption')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Radio.Group',
        'x-component-props': {
          options: [
            { label: "{{t('marketing.yes')}}", value: true },
            { label: "{{t('marketing.no')}}", value: false },
          ],
        },
      },
      max_length: {
        type: 'number',
        title: "{{t('purchase.maxLength')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'InputNumber',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseEnterMaxLength')}}",
          min: 1,
          max: 1000,
          style: { width: '100%' },
        },
      },
      remark: {
        type: 'string',
        title: "{{t('common.remark')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input.TextArea',
        'x-component-props': {
          placeholder: "{{t('purchase.pleaseEnterRemark')}}",
          rows: 3,
          maxlength: 500,
          showWordLimit: true,
        },
      },
    },
  };

  const [Drawer, drawerApi] = useIgourdDrawer({});

  const { Form, formAPI } = useIgourdForm({
    schema: formSchema,
    useI18n,
  });

  return {
    Drawer,
    Form,
    formAPI,
    drawerApi,
  };
}
