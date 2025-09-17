import type { ISchema } from '@igourd/common-ui';

import { useIgourdDrawer } from '@igourd/common-ui';
// import { useAccountForm } from '@@/account/hooks/use-account-form';

export function useAccountForm() {
  const formSchema: ISchema = {};

  const [Drawer, drawerApi] = useIgourdDrawer({
    onOpenChange(isOpen) {
      if (!isOpen) {
        formAPI.setValues(drawerApi.getData() || {});
      }
    },
    async onConfirm() {
      await formAPI.validate();
      await formAPI.submit(saveOrUpdate);
      drawerApi.close();
    },
  });

  const { Form, formAPI } = useAccountForm({
    scope: {},
  });
}
