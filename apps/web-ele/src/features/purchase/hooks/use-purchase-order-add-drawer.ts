import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '@igourd/common-ui';
import PurchaseOrderAddDrawer from '../components/purchase-order-add-drawer.vue';

export function usePurchaseOrderAddDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: PurchaseOrderAddDrawer,
    title: "{{t('purchase.addOrder')}}",
    size: '86%',
  });

  const handleOpen = (data: {
    title?: string;
    id?: string;
  }) => {
    drawerApi.open({
      returnAddTitle: data.title || t('purchase.addOrder'),
      drawerAddShow: true,
      id: data.id || '',
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

