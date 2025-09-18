import type { ISchema } from '@igourd/common-ui';

import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

export function useListForm() {
  const { t } = useI18n();

  const schema: ISchema = {
    type: 'object',
    properties: {
      form: {
        type: 'object',
        'x-component': 'Card',
        'x-component-props': {
          labelCol: 6,
          wrapperCol: 14,
          title: '111',
        },
        properties: {
          name: {
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: t('purchase.name'),
            },
          },
        },
      },
    },
  };
  return useDrawerForm({
    drawerOptions: {
      title: t('customized.addCustomized'),
      appendToMain: true,
      class: 'w-full',
    },
    formOptions: {
      schema,
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
    },
  });
}
