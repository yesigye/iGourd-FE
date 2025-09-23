import { useDrawerForm } from '#/hooks';

import schema from './form-schema';

export function useNotesForm() {
  return useDrawerForm({
    drawerOptions: {
      title: 'ddd',
      class: 'w-full',
      appendToMain: true,
    },
    formOptions: {
      schema,
    },
  });
}
