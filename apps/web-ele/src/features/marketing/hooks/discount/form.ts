import { useDrawerForm } from '#/hooks';

import schema from './form-schema';

export function useDiscountForm() {
  return useDrawerForm({
    drawerOptions: {
      title: 'ddd',
      class: 'w-full',
      appendToMain: true,
    },
    formOptions: {
      initialValues: {
        apply_vip: 1,
      },
      schema,
      handleSubmit() {},
    },
  });
}
