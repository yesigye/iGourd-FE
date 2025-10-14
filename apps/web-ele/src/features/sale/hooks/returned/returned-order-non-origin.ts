import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { returnedOrderOriginDrawer } from '@@/sale/components/returned';

export function useReturnedOrderNonOriginDrawer() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: returnedOrderOriginDrawer,
    appendToMain: true,
    class: 'w-2/3',
    title: '非原单退款',
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
