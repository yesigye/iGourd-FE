import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

export function useOrderForm() {
  const { t } = useI18n();

  const [Drawer, drawerAPI] = useIgourdDrawer({
    class: 'w-full',
    appendToMain: true,
    title: 'Hello',
  });
  return {
    t,
    Drawer,
    drawerAPI,
  };
}
