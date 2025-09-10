import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import InventoryCountDetailDrawer from '../components/inventory-count-detail-drawer.vue';

export function useInventoryCountDetailDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: InventoryCountDetailDrawer,
    title: "{{t('inventory.countDetail')}}",
    size: '86%',
  });

  const handleOpen = (title?: string) => {
    drawerApi.open({
      returnTitle: title || t('inventory.countDetail'),
      drawerReturnShow: true,
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

