import { useDrawerForm } from '#/hooks';
import { useI18n } from '@igourd/locales';
// import { useUserStore } from '@igourd/stores';
import { useCollectionVoucherSchema } from './form-schema';
import { getSaleOrderListApi } from '#/features/sale';

export function useCollectionVoucherForm() {
  const { t } = useI18n();
  function onSelectOrder(record: any) {
    record = {
      ...record,
      order_total_amount: record.total_amount,
      repaid_amount: `${record.repaid_amount}`,
      business_type: 'SALES_ORDER_RETURNED',
    };
    formAPI.setValues({ receipt_order_item_list: [record] });
  }
  const { Drawer, Form, formAPI } = useDrawerForm({
    drawerOptions: {
      title: t('classification.add-class'),
      appendToMain: true,
      class: 'w-full',
    },
    formOptions: {
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
          });
        },
      }),
    },
  });
  return { Drawer, Form, formAPI };
}
