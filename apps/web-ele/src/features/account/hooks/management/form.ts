import { computed, inject, ref, unref } from 'vue';

import { onFieldInputValueChange } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { useDrawerForm } from '#/hooks/use-drawer-form';

import { getMaxCodeLeafAccounts } from '../../apis';
import { getBalanceDirection, useLeafLedgers } from '../leaf-ledgers';
import bankSchema from './bank-schema';
import cashSchema from './cash-schema';

export function useManagementForm() {
  const { t } = useI18n();

  const leafLedgers = useLeafLedgers();
  const {
    currencySymbol,
    merchantInfo: { account_set_id },
  } = useUserStore();
  const relationFlag = ref(true);
  const { type } = inject(Symbol.for('FormType'), { type: ref('CASH') });

  const schema = computed(() => {
    return unref(type) === 'CASH' ? cashSchema : bankSchema;
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
      initialValues: {
        belong_type: 'NONE',
      },
      effects(form) {
        onFieldInputValueChange('code', () => {
          relationFlag.value = false;
        });
        onFieldInputValueChange('account_ledger_id', async (field) => {
          const bd = leafLedgers.value.find((it) => it.id === field.value);

          const direction = getBalanceDirection(bd.balance_direction);

          form.setValuesIn('balance_direction_sort', direction);
          if (form.getValuesIn('id')) {
            return;
          }
          if (!relationFlag.value) {
            return;
          }

          const maxCode = await getMaxCodeLeafAccounts(
            {
              account_set_id,
              account_ledger_id: bd.id,
            },
            false,
            bd.code,
          );
          form.setValuesIn('code', maxCode);
        });
        onFieldInputValueChange('initial_balance', (field) => {
          if (Reflect.has(drawerApi.getData(), 'id')) {
            return;
          }
          form.setValuesIn('current_balance', field.value);
        });
      },
      scope: {
        leafLedgers,
        currencySymbol,
      },
      schema: unref(schema),
    },
  });
  return { drawerApi, Drawer, Form, schema };
}
