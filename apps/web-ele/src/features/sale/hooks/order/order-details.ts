import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { SaleOrderDetailsDrawer } from '@@/sale/components';

export function useSaleOrderDetailsDrawer() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SaleOrderDetailsDrawer,
    appendToMain: true,
    class: 'w-2/3',
    title: '订单详情',
    showConfirmButton: false,
    showCancelButton: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
