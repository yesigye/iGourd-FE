import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { PurchaseOrderDetailDrawer } from '@@/purchase/components';

export function usePurchaseOrderDetail() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseOrderDetailDrawer,
    appendToMain: true,
    class: 'w-2/3',
    title: t('order.purchase-order-detail'),
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
