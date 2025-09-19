import type { ISchema } from '@formily/json-schema';

import type { IGourdFormProps } from '@igourd-core/form-ui';

import { useI18n } from '@igourd/locales';

import {
  setupIgourdForm,
  useIgourdForm as useCoreIgourdForm,
  useTableSearchForm as useCoreTableSearchForm,
} from '@igourd-core/form-ui';

import './components/style';

export * from './components';

export * from './formily';

// export * from '@igourd-core/form-ui';

export * from './ui';
export * from '@formily/reactive';
export * from '@igourd-core/popup-ui';

export function useIgourdForm<T extends object>(options: IGourdFormProps<T>) {
  if (!options.useI18n) {
    options.useI18n = useI18n;
  }
  return useCoreIgourdForm(options);
}

export function useTableSearchForm<T extends object>(
  options: Omit<IGourdFormProps<T>, 'schema'> & {
    schema: ISchema['properties'];
  },
) {
  if (!options.useI18n) {
    options.useI18n = useI18n;
  }
  return useCoreTableSearchForm(options);
}
export { setupIgourdForm };
export type { IGourdFormProps };
