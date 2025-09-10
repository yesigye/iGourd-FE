import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import PurchaseOrderClearingDetailDrawer from '../components/purchase-order-clearing-detail-drawer.vue';

export function usePurchaseOrderClearingDetailDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: PurchaseOrderClearingDetailDrawer,
    title: "{{t('set.productDetails')}}",
    size: '750px',
  });

  const handleOpen = (data: {
    title?: string;
    clearingData?: any;
  }) => {
    drawerApi.open({
      clearingDetailTitle: data.title || t('set.productDetails'),
      clearingDetailShow: true,
      clearingData: data.clearingData || null,
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

