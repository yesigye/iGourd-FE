import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { useDrawerForm } from '#/hooks/use-drawer-form';

import schema from './form-schema';

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
    },
  });
}
