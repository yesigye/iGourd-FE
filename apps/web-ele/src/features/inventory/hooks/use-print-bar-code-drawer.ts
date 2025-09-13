import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '@igourd/common-ui';
import PrintBarCodeDrawer from '../components/print-bar-code-drawer.vue';

export function usePrintBarCodeDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: PrintBarCodeDrawer,
    title: "{{t('inventory.printBarCode')}}",
    size: '45%',
  });

  const handleOpen = (title?: string) => {
    drawerApi.open({
      printTitle: title || t('inventory.printBarCode'),
      printShow: true,
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

