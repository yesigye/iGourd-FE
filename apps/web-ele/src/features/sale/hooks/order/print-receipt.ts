import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { SaleOrderPrintReceiptDrawer } from '@@/sale/components/order';

export function useSaleOrderPrintReceiptDrawer() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleOrderPrintReceiptDrawer,
    appendToMain: true,
    class: 'w-1/3',
    title: '打印小票',
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
