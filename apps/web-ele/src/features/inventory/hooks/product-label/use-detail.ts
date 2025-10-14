import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ProductLabelDetailDrawer } from '@@/inventory/components';
export function useProductLabelDetail() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ProductLabelDetailDrawer,
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
