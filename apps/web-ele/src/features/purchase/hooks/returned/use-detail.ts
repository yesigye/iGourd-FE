import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { PurchaseReturnDetailDrawer } from '@@/purchase/components';
export function usePurchaseReturnDetail() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseReturnDetailDrawer,
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
