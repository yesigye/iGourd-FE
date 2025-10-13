import { observable, onFieldChange } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { pick } from '@igourd/utils';

import { getFinanceCategoryOptions } from '@@/account/apis';

import { useDrawerForm } from '#/hooks';

import schema from './form-schema-new';

interface ISelectItem {
  label: string;
  value: string;
}

const accountOptions = observable<{ value: Array<ISelectItem> }>({ value: [] });
const targetOptions = observable<{ value: Array<ISelectItem> }>({ value: [] });

export function useNotesForm() {
  const { t } = useI18n();

  function remoteMethod(keywords: string) {
    const type = formAPI.getValuesIn('change_type');
    return getFinanceCategoryOptions({
      type,
      keywords,
      page_size: 20,
      page_num: 1,
    });
  }
  function handleCateSelect(op: any) {
    const keys = ['target_account_ledger_code', 'account_ledger_codes'];
    formAPI.setValuesIn(keys, pick(op, keys));
  }

  const { Drawer, Form, drawerApi, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('common.add'),
      class: 'w-[760px]',
      contentClass: 'bg-muted px-0',
      appendToMain: true,
    },
    formOptions: {
      effects(form) {
        onFieldChange(
          ['target_account_ledger_code', 'account_ledger_codes'],
          (f) => {
            options.value = [{ value: '111', label: '222' }];
          },
        );
        onFieldChange('change_type', () => {
          form.setValuesIn('finance_category_id', '');
        });
      },
      schema,
      initialValues: {
        change_type: 'REVENUE',
        item_create_volist: [{}],
        external_account_data: [{}],
      },
      scope: {
        accountOptions,
        targetOptions,
        handleCateSelect,
        remoteMethod,
        receivingAccount: [],
        receivingTargetAccount: [],
        payRevenueOption: [],
        payPurchaseOption: [],
      },
    },
  });
  return { Drawer, Form, drawerApi, formAPI };
}
