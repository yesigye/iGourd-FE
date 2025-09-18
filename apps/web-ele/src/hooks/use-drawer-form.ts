import type { DrawerApiOptions, IGourdFormProps } from '@igourd/common-ui';

import type { Service } from '.';

import type { ExtendedVxeGridApi } from '#/adapter/vxe-table';

import { inject } from 'vue';

import { useIgourdDrawer, useIgourdForm } from '@igourd/common-ui';

interface DrawerFormOptions {
  drawerOptions: DrawerApiOptions;
  formOptions: IGourdFormProps<object>;
}

export function useDrawerForm(options: DrawerFormOptions) {
  let handleSubmit = options.formOptions.handleSubmit;
  const { gridApi, service } = inject<{
    gridApi: ExtendedVxeGridApi;
    service: Partial<Service<unknown, unknown>>;
  }>(Symbol.for('PageGrid'), {} as unknown as any);
  const onConfirm = options.drawerOptions.onConfirm;
  options.drawerOptions.onConfirm = async function () {
    if (onConfirm) {
      onConfirm();
    }
    await formAPI.validate();
    drawerApi.lock();

    try {
      if (handleSubmit) {
        await handleSubmit(formAPI.values);
      } else {
        await (Reflect.has(formAPI.values, 'id')
          ? service.update?.(formAPI.values)
          : service.create?.(formAPI.values));
        gridApi?.reload();
        drawerApi.close();
      }
    } finally {
      drawerApi.unlock();
    }
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
