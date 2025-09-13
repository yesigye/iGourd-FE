import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '@igourd/common-ui';
import UnpackOrPackModalDrawer from '../components/unpack-or-pack-modal-drawer.vue';

export function useUnpackOrPackModalDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: UnpackOrPackModalDrawer,
    title: "{{t('inventory.unpackOrPack')}}",
    size: '920px',
  });

  const handleOpen = (title?: string) => {
    drawerApi.open({
      unpackOrPackTitle: title || t('inventory.unpackOrPack'),
      unpackOrPackShow: true,
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

