import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import WarehouseAddDrawer from '../components/warehouse-add-drawer.vue';

export function useWarehouseAddDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: WarehouseAddDrawer,
    title: "{{t('inventory.warehouseAdd')}}",
    size: '45%',
  });

  const handleOpen = (title?: string) => {
    drawerApi.open({
      warehouseAddTitle: title || t('inventory.warehouseAdd'),
      warehouseAddShow: true,
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

