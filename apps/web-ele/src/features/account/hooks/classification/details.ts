import { useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { ClassificationDetailsDrawer } from '@@/account/components';

export function useClassificationDetails() {
  const { t } = useI18n();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ClassificationDetailsDrawer,
    appendToMain: true,
    class: 'w-1/4',
    title: t('classification.detail'),
    closable: false,
    showConfirmButton: false,
    cancelText: t('common.close'),
  });
  return {
    Drawer,
    drawerApi,
  };
}
