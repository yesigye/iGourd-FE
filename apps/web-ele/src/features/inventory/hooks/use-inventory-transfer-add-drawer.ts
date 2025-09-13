import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '@igourd/common-ui';
import InventoryTransferAddDrawer from '../components/inventory-transfer-add-drawer.vue';

export function useInventoryTransferAddDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: InventoryTransferAddDrawer,
    title: "{{t('inventory.inventoryTransferAdd')}}",
    size: '86%',
  });

  const handleOpen = (data: {
    title?: string;
    disabled?: boolean;
  }) => {
    drawerApi.open({
      inventoryAddTitle: data.title || t('inventory.inventoryTransferAdd'),
      inventoryAddShow: true,
      disabled: data.disabled || false,
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

