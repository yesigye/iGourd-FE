import {
  observable,
  onFieldInputValueChange,
  useIgourdForm,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useDrawerForm } from '#/hooks/use-drawer-form';

import bankSchema from './bank-schema';
import cashSchema from './cash-schema';
import { useUserStore } from '@igourd/stores';
import { getLeafLedgersOptions, getMaxCodeLeafAccounts } from '../../apis';
import { computed, inject, ref, unref } from 'vue';

export function useManagementForm() {
  const { t } = useI18n();

  /** balance_direction 科目余额方向枚举(DEBIT:借方向,CREDIT:贷方向)
   * 在添加账户的时候展示为 CR/DR
   * 这里做一层转换
   */
  const getBalanceDirection = (balanceDirection: string): string => {
    switch (balanceDirection.toUpperCase()) {
      case 'DEBIT':
        return 'DR';
      case 'CREDIT':
        return 'CR';
      default:
        return '';
    }
  };

  const leafLedgers = observable<{ value: any[] }>({
    value: [],
  });
  const {
    currencySymbol,
    merchantInfo: { account_set_id },
  } = useUserStore();
  const relationFlag = ref(true);

  getLeafLedgersOptions({ account_set_id }).then((res) => {
    leafLedgers.value = res;
  });
  const { type } = inject(Symbol.for('FormType'), { type: ref('CASH') });

  const schema = computed(() => {
    return unref(type) === 'CASH' ? cashSchema : bankSchema;
  });

  const { drawerApi, Drawer, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('classification.add-class'),
      appendToMain: true,
      class: 'w-[760px]',
      destroyOnClose: true,
      contentClass: 'bg-muted px-0',
      onOpened() {
        // formAPI.setFormState()
      },
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
