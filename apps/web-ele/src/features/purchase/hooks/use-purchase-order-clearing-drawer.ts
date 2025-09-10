import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import PurchaseOrderClearingDrawer from '../components/purchase-order-clearing-drawer.vue';

export function usePurchaseOrderClearingDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: PurchaseOrderClearingDrawer,
    title: "{{t('purchase.orderClearing')}}",
    size: '750px',
  });

  const handleOpen = (data: {
    title?: string;
    orderId?: string;
  }) => {
    drawerApi.open({
      clearingTitle: data.title || t('purchase.orderClearing'),
      clearingShow: true,
      orderId: data.orderId || '',
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

