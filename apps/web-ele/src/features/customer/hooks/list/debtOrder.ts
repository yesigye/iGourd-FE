import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { BalanceChangeDrawer } from '@@/customer/components';

export function useDebtOrder() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: BalanceChangeDrawer,
    appendToMain: true,
    class: 'w-1/4',
    title: t('list.debt-order'),
    closable: false,
    showConfirmButton: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
