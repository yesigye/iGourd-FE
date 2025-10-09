import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { SelectGuiderDrawer } from '@@/sale/components/scan';

export function useSelectGuider() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: SelectGuiderDrawer,
    appendToMain: true,
    class: 'w-2/3',
    title: t('scan.select-guider'),
    footer: false,
  });
  return {
    Drawer,
    drawerApi,
  };
}
