import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '#/adapter/drawer';
import PurchaseBillsAddDrawer from '../components/purchase-bills-add-drawer.vue';

export function usePurchaseBillsAddDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: PurchaseBillsAddDrawer,
    title: "{{t('purchase.addBill')}}",
    size: '86%',
  });

  const handleOpen = (data: {
    title?: string;
  }) => {
    drawerApi.open({
      returnAddTitle: data.title || t('purchase.addBill'),
      drawerAddShow: true,
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

