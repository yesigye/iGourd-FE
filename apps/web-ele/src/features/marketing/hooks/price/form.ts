import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks';

import schema from './form-schema';

export function usePriceForm() {
  const { t } = useI18n();
  return useDrawerForm({
    drawerOptions: {
      title: t('price.add-price'),
      class: 'w-full',
      appendToMain: true,
    },
    formOptions: {
      schema,
    },
  });
}
