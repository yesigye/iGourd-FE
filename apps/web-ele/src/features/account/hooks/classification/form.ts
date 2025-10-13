import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

import schema from './form-schema';
import { useUserStore } from '@igourd/stores';

export function useClassificationForm() {
  const { t } = useI18n();
  const {
    merchantInfo: { account_set_id },
  } = useUserStore();
  return useDrawerForm({
    drawerOptions: {
      title: t('classification.add-class'),
      appendToMain: true,
      class: 'w-[760px]',
      contentClass: 'bg-muted px-0',
    },
    formOptions: {
      schema: schema(account_set_id),
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
