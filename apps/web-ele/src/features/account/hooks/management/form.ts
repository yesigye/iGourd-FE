import { observable, onFieldInputValueChange } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

import schema from './bank-schema';
import cashSchema from './cash-schema';
import { useUserStore } from '@igourd/stores';
import { getLeafLedgersOptions } from '../../apis';

export function useManagementForm(type: 'CASH' | 'CARD') {
  const { t } = useI18n();

  const leafLedgers = observable<{ value: any[] }>({
    value: [],
  });
  const {
    currencySymbol,
    merchantInfo: { account_set_id },
  } = useUserStore();
  console.log(currencySymbol)
  getLeafLedgersOptions({ account_set_id }).then((res) => {
    leafLedgers.value = res;
  });

  const { drawerApi, Drawer, Form } = useDrawerForm({
    drawerOptions: {
      title: t('classification.add-class'),
      appendToMain: true,
      class: 'w-[760px]',
      destroyOnClose: true,
      contentClass: 'bg-muted px-0',
    },
    formOptions: {
      effects(form) {
        onFieldInputValueChange('account_ledger_id', (field) => {
          const bd = leafLedgers.value.find(
            (it) => it.id === field.value,
          )?.balance_direction;
          form.setValuesIn('balance_direction_sort', bd);
        });
      },
      scope: {
        leafLedgers,
        currencySymbol,
      },
      schema: type === 'CASH' ? cashSchema : schema,
    },
  });
  return { drawerApi, Drawer, Form };
}
