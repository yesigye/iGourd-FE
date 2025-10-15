import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { SaleRefundOrderPrintReceipt } from '@@/sale/components';

export function useSaleRefundOrderPrintReceiptDrawer() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleRefundOrderPrintReceipt,
    appendToMain: true,
    class: 'w-1/3',
    title: '打印小票',
  });
  return {
    Drawer,
    drawerApi,
  };
}
