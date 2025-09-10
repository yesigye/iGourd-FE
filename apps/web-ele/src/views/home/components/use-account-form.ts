import { useI18n } from '@igourd/locales';
import { useIgourdDrawer, useIgourdForm, type ISchema } from '@igourd/common-ui';
import { createOrUpdateAccountApi } from '@@/account/apis/account';
// import { useAccountForm } from '@@/account/hooks/use-account-form';

export function useAccountForm() {
  const formSchema:ISchema = {};

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
