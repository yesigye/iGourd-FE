import { useDrawerForm } from '#/hooks';
import { onFieldInputValueChange, onFieldValueChange } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import {
  accountLedgerBalanceDirectionOptions,
  getBalanceDirection,
  useAccountLedgerCategoryOptions,
  useLeafLedgers,
} from '../leaf-ledgers';
import { useUserStore } from '@igourd/stores';
import accountFormSchema from './account-schema';
import subjectSchema from './subject-schema';
import { computed, ref, unref } from 'vue';
import type { IChatOfAccountProps } from '../../components';
import { useNewParentIdOptions } from '../account-ledger-balance';
import { getMaxCodeLeafAccounts } from '../../apis';

export function useChartOfAccountsForm(props: IChatOfAccountProps) {
  const { t } = useI18n();
  const leafLedgers = useLeafLedgers();
  const { currencySymbol } = useUserStore();
  const relationFlag = ref<boolean>(false);
  const categoryOptions = useAccountLedgerCategoryOptions().map((i) => {
    return {
      ...i,
      label: t(`${i.label}`),
    };
  });
  const blanceDirectionOptions = accountLedgerBalanceDirectionOptions().map(
    (i) => {
      return {
        ...i,
        label: t(`${i.label}`),
      };
    },
  );

  const { query, options: parentOptions } = useNewParentIdOptions();
  const schema = computed(() => {
    return props.type === 'ledger' ? accountFormSchema : subjectSchema;
  });

  const { drawerApi, Drawer, Form } = useDrawerForm({
    drawerOptions: {
      title:
        props.type === 'ledger'
          ? t('chart-of-accounts.add-account-ledger')
          : t('account.add-sub-ledger'),
      appendToMain: true,
      class: 'w-1/2',
    },
    formOptions: {
      schema: unref(schema),
      initialValues: {
        product_spec_name: '',
        belong_type: 'NONE',
      },
      scope: {
        parentOptions,
        leafLedgers,
        categoryOptions,
        currencySymbol,
        blanceDirectionOptions
      },
      effects(form) {
        onFieldInputValueChange('code', () => {
          relationFlag.value = false;
        });
        onFieldInputValueChange('account_ledger_id', async (field) => {
          const bd = leafLedgers.value.find((it) => it.id === field.value);

          const direction = getBalanceDirection(bd.balance_direction);

          form.setValuesIn('balance_direction_sort', direction);
          const currentItem = leafLedgers.value.find(
            (item) => item.id === field.value,
          );
          form.setValuesIn('code', currentItem.code);
        });
        onFieldInputValueChange('account_ledger_id', (field) => {
          const currentItem = leafLedgers.value.find(
            (item) => item.id === field.value,
          );
          form.setValuesIn('code', currentItem.code);
          // us
        });
        onFieldInputValueChange('initial_balance', (field) => {
          if (Reflect.has(drawerApi.getData(), 'id')) {
            return;
          }
          form.setValuesIn('current_balance', field.value);
        });
        onFieldValueChange('category', (field) => {
          if (!field.value) return;

          query(field.value);
        });
      },
    },
  });
  return { drawerApi, Drawer, Form, schema };
}
