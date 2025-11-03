import type { ISchema } from '@igourd/common-ui';

import { ref } from 'vue';

import { onFormValuesChange, useIgourdForm } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

export function useSettingCodeRulesDrawerSkuForm(index: number) {
  const { t } = useI18n();
  const formSchema: ISchema = {
    type: 'object',
    properties: {
      input: {
        type: 'string',
        title: `Code Part ${index}`,
        enum: [
          {
            label: '常量',
            value: '1',
          },
          {
            label: '时间',
            value: '2',
          },
          {
            label: '流水号',
            value: '3',
          },
        ],
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
      value: {
        type: 'string',
        title: 'set value',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-visible': "{{$values.input === '1'}}",
      },
      date: {
        type: 'string',
        title: 'Date format',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-visible': "{{$values.input === '2'}}",
      },
      length: {
        type: 'string',
        title: 'length',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-visible': "{{$values.input === '3'}}",
      },
      initialValue: {
        type: 'string',
        title: 'Initial value',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-visible': "{{$values.input === '3'}}",
      },
    },
  };
  const rulesItemData = ref({});
  const { Form, formAPI } = useIgourdForm({
    useI18n,
    schema: formSchema,
    readPretty: false,
    initialValues: {
      input: '',
      value: '',
      date: '',
      length: '',
      initialValue: '',
    },
    effects() {
      // 使用 Formily 的 effects 监听表单值变化
      onFormValuesChange((form) => {
        // 处理表单值变化
        rulesItemData.value = { ...form.values };
      });
    },
    scope: {
      featureTypes: [
        { label: t('purchase.inputBox'), value: 'INPUT' },
        { label: t('purchase.selectBox'), value: 'SELECT' },
      ],

      // 选择类型（用户创建 / 固定值）
      // 注意：你原文件里 true=用户创建, false=固定值；保留相同语义
      selectTypes: [
        { label: t('purchase.userCreated'), value: true },
        { label: t('purchase.fixedValue'), value: false },
      ],

      // 是否必填
      compulsoryTypes: [
        { label: t('purchase.yes'), value: true },
        { label: t('purchase.no'), value: false },
      ],
    },
  });
  return {
    Form,
    formAPI,
    rulesItemData,
    formSchema,
  };
}
