import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { TakeDetail } from '@@/sale/components/scan';

export function useTakeDetail() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: TakeDetail,
    destroyOnClose: true,
    appendToMain: true,
    class: 'w-2/3',
    title: t('scan.take'),
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
