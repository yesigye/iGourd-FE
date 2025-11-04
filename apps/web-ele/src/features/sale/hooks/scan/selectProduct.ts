import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { SelectProductsDrawer } from '@@/sale/components/scan';

export function useSelectProduct() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SelectProductsDrawer,
    appendToMain: true,
    class: 'w-3/4',
    title: t('scan.select-product'),
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
