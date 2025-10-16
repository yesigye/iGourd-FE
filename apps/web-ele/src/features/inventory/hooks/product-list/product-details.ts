import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ProductDetailsDrawer } from '@@/inventory/components';

export function useProductDetails() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ProductDetailsDrawer,
    appendToMain: true,
    class: 'w-full',
    title: t('product-list.product-details'),
    closable: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
