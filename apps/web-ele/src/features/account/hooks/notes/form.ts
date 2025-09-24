import { useDrawerForm } from '#/hooks';

import schema from './form-schema';
import { useI18n } from '@igourd/locales';
export function useNotesForm() {
  const { t } = useI18n();
  return useDrawerForm({
    drawerOptions: {
      title: t('notes.add-note'),
      class: 'w-full',
      appendToMain: true,
    },
    formOptions: {
      schema,
      scope: {
        receivingAccount: [],
        receivingTargetAccount: [],
        payRevenueOption: [],
        payPurchaseOption: [],
      },
    },
  });
}
