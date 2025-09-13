import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '@igourd/common-ui';
import InventoryProductsDetailDrawer from '../components/inventory-products-detail-drawer.vue';

export function useInventoryProductsDetailDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: InventoryProductsDetailDrawer,
    title: "{{t('inventory.productsDetail')}}",
    size: '86%',
  });

  const handleOpen = (data: {
    productId?: string;
    tag?: string;
    title?: string;
  }) => {
    drawerApi.open({
      returnTitle: data.title || t('inventory.productsDetail'),
      drawerReturnShow: true,
      productId: data.productId,
      tag: data.tag,
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

