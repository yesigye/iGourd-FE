import { observable } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import schema from './form-schema';
import { useDrawerForm } from '#/hooks/use-drawer-form';

export function useExchangeForm() {
  const { t } = useI18n();
  const currencyOptions = observable<{ value: any[] }>({ value: [] });

  return useDrawerForm({
    drawerOptions: {
      title: t('classification.add-class'),
      appendToMain: true,
      class: 'w-[760px]',
    },
    formOptions: {
      schema,
      scope: {
        currencyOptions,
      },
    },
  });
}
