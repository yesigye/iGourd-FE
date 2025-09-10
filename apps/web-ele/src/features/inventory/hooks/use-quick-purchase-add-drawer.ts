import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import QuickPurchaseAddDrawer from '../components/quick-purchase-add-drawer.vue';

export function useQuickPurchaseAddDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: QuickPurchaseAddDrawer,
    title: "{{t('inventory.quickPurchaseAdd')}}",
    size: '86%',
  });

  const handleOpen = (title?: string) => {
    drawerApi.open({
      quickPuchaseTitle: title || t('inventory.quickPurchaseAdd'),
      quickPuchaseShow: true,
    });
  };

  const handleClose = () => {
    drawerApi.close();
  };

  return {
    Drawer,
    drawerApi,
    handleOpen,
    handleClose,
  };
}

