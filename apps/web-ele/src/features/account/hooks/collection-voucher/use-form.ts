import { useDrawerForm } from '#/hooks';
import { useI18n } from '@igourd/locales';
// import { useUserStore } from '@igourd/stores';
import { useCollectionVoucherSchema } from './form-schema';
import { getSaleOrderListApi } from '#/features/sale';
import { useUserStore } from '@igourd/stores';

export function useCollectionVoucherForm(props: any) {
  const { t } = useI18n();
  const { currencySymbol, merchant_id } = useUserStore();
  function onSelectOrder(record: any) {
    record = {
      ...record,
      order_total_amount: record.total_amount,
      repaid_amount: `${record.repaid_amount}`,
      business_type: props.business_type,
    };
    formAPI.setValues({ order_info: [record], receipt_order_item_list: [{}] });
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
        receipt_order_item_list: [{}],
        receipt_direction: 'POSITIVE_ORDER',
      },
      scope: {
        business_type: props.business_type,
        currencySymbol,
        merchant_id,
      },
      schema: useCollectionVoucherSchema({
        onBeforeOpen() {
          return formAPI.validate('customer_id');
        },
        onSelectOrder,
        orderListApi(data: any) {
          const customer_id = formAPI.getValuesIn('customer_id');
          return getSaleOrderListApi({
            ...data,
            customer_id,
            payment_type: 'CREDIT',
            status_list: ['NO_REPAID', 'PARTIAL_REPAID'],
          });
        },
      }),
    },
  });
  return { Drawer, Form, formAPI };
}
