import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ScanOrderSettle } from '@@/sale/components/scan';

export function useScanOrderSettle() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ScanOrderSettle,
    appendToMain: true,
    class: 'w-2/3',
    title: '支付',
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
