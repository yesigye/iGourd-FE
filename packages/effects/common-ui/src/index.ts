import type { IGourdFormProps } from '@igourd-core/form-ui';
import './components/style';
import { useI18n } from '@igourd/locales';

export * from './components';

export * from './ui';

// export * from '@igourd-core/form-ui';

export * from '@igourd-core/popup-ui';

export * from './formily';

import {
  setupIgourdForm,
  useIgourdForm as useCoreIgourdForm,
  useTableSearchForm as useCoreTableSearchForm,
} from '@igourd-core/form-ui';

import type { ISchema } from '@formily/json-schema';

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
