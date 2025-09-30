import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { SelectCustomersDrawer } from '@@/sale/components/scan';

export function useSelectCustomer() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SelectCustomersDrawer,
    appendToMain: true,
    class: 'w-2/3',
    title: t('scan.select-customer'),
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
