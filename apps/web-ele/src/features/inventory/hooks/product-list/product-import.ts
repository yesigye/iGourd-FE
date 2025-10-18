import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ProductImportDrawer } from '@@/inventory/components';
import { inject } from 'vue';

export function useProductImport() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ProductImportDrawer,
    appendToMain: true,
    class: 'w-full',
    title: t('product-list.product-import'),
    closable: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
