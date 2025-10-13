import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ProductListDrawer } from '@@/inventory/components';

export function useAddProduct() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ProductListDrawer,
    appendToMain: true,
    class: 'w-full',
    title: t('product-list.add-product'),
  });
  return {
    Drawer,
    drawerApi,
  };
}
