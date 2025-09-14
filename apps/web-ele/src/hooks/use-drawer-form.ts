import {
  useIgourdForm,
  useIgourdDrawer,
  type IGourdFormProps,
  type DrawerApiOptions,
} from '@igourd/common-ui';
import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';
import { inject } from 'vue';

interface DrawerFormOptions {
  drawerOptions: DrawerApiOptions;
  formOptions: IGourdFormProps<object>;
}

export function useDrawerForm(options: DrawerFormOptions) {
  const handleSubmit = options.formOptions.handleSubmit;
  const gridApi = inject<ExtendedVxeGridApi>(Symbol.for('PageGrid'));
  const onConfirm = options.drawerOptions.onConfirm;
  options.drawerOptions.onConfirm = async function () {
    if (onConfirm) {
      onConfirm();
    }
    await formAPI.validate();
    drawerApi.lock();
    if (handleSubmit) {
      await handleSubmit(formAPI.values);
    }

    gridApi?.reload();
    drawerApi.unlock();
    drawerApi.close();
  };
  if (!options.drawerOptions.onOpenChange) {
    options.drawerOptions.onOpenChange = function (isOpen) {
      if (isOpen) {
        formAPI.setValues(drawerApi.getData());
      } else {
        formAPI.reset();
      }
    };
  }

  const [Drawer, drawerApi] = useIgourdDrawer(options.drawerOptions);
  const { Form, formAPI } = useIgourdForm(options.formOptions);

  return { Drawer, Form, drawerApi, formAPI };
}
