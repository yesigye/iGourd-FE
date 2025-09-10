import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import ProductImportDrawer from '../components/product-import-drawer.vue';

export function useProductImportDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: ProductImportDrawer,
    title: "{{t('inventory.productImport')}}",
    size: '86%',
  });

  const handleOpen = (title?: string) => {
    drawerApi.open({
      productImportTitle: title || t('inventory.productImport'),
      productImportShow: true,
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

