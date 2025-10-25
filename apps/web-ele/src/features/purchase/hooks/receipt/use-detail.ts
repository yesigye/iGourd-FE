import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ReceiptOrderDetailDrawer } from '@@/purchase/components';

export function useReceiptOrderDetail() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ReceiptOrderDetailDrawer,
    appendToMain: true,
    class: 'w-2/3',
    title: t('receipt.receipt-order-detail'),
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
