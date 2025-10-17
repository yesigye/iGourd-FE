import { useDrawerForm } from '#/hooks';
import { useI18n } from '@igourd/locales';
// import { useUserStore } from '@igourd/stores';
import { useCollectionVoucherSchema } from './form-schema';
import { useUserStore } from '@igourd/stores';
import { sum } from '@igourd/utils';
import { getAccountManagementOptionList } from '../../apis';
import { merchantPaymentMethodOption } from '#/features/setting';

export function useCollectionVoucherForm(props: any) {
  const { t } = useI18n();
  const { currencySymbol, merchant_id } = useUserStore();
  //@ts-ignore
  function accountChange(_, op, record, index) {
    if (!op) {
      return;
    }
    formAPI.setValuesIn(
      `receipt_order_item_list.${index}.account_ledger_id`,
      op.account_ledger_id,
    );
    // record.account_ledger_id = op.account_ledger_id;
  }
  //@ts-ignore
  function payment_method_change(_, op, record, index) {
    if (!op) {
      return;
    }
    formAPI.setValuesIn(
      `receipt_order_item_list.${index}.payment_method_mark`,
      op.mark,
    );
  }
  const { Drawer, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('classification.add-class'),
      appendToMain: true,
      class: 'w-3/4',
      contentClass: 'bg-muted px-0',
    },
    formOptions: {
      initialValues: {
        receipt_direction: 'POSITIVE_ORDER',
      },
      scope: {
        business_type: props.business_type,
        currencySymbol,
        merchant_id,
        getAccountManagementOptionList,
        accountChange,
        sum,
        merchantPaymentMethodOption,
        payment_method_change,
      },
      schema: useCollectionVoucherSchema(),
    },
  });
  return { Drawer, Form, formAPI };
}
