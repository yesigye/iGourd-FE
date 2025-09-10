import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import InventoryTransferExamineDrawer from '../components/inventory-transfer-examine-drawer.vue';

export function useInventoryTransferExamineDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: InventoryTransferExamineDrawer,
    title: "{{t('inventory.transferExamine')}}",
    size: '500px',
  });

  const handleOpen = (data: {
    title?: string;
    currentData?: any;
  }) => {
    drawerApi.open({
      examineTitle: data.title || t('inventory.transferExamine'),
      examineShow: true,
      currentData: data.currentData || null,
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

