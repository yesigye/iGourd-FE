import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { returnedOrderDrawer } from '@@/sale/components/returned';

export function useReturnedOrderDrawer() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: returnedOrderDrawer,
    appendToMain: true,
    class: 'w-2/3',
    title: t('returned.refund'),
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
