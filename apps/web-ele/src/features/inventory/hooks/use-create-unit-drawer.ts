import { ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '@igourd/common-ui';
import CreateUnitDrawer from '../components/create-unit-drawer.vue';

export function useCreateUnitDrawer() {
  const { t } = useI18n();

  const { Drawer, drawerApi } = useIgourdDrawer({
    connectedComponent: CreateUnitDrawer,
    title: "{{t('inventory.createUnit')}}",
    size: '45%',
  });

  const handleOpen = (data: {
    title?: string;
    editId?: string;
  }) => {
    drawerApi.open({
      roleTitle: data.title || t('inventory.createUnit'),
      draweListShow: true,
      editId: data.editId || '',
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

