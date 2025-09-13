import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '@igourd/common-ui';
import InventorySpoilageAddDrawer from '../components/inventory-spoilage-add-drawer.vue';

export function useInventorySpoilageAddDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: InventorySpoilageAddDrawer,
    title: "{{t('inventory.inventorySpoilageAdd')}}",
    size: '86%',
  });

  const handleOpen = (data: {
    title?: string;
    isReadOnly?: boolean;
  }) => {
    drawerApi.open({
      inventoryAddTitle: data.title || t('inventory.inventorySpoilageAdd'),
      inventoryAddShow: true,
      isReadOnly: data.isReadOnly || false,
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

