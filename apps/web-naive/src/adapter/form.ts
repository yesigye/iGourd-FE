import type {
  IgourdFormSchema as FormSchema,
  IgourdFormProps,
} from '@igourd/common-ui';

import type { ComponentType } from './component';

import { setupIgourdForm, useIgourdForm as useForm, z } from '@igourd/common-ui';
import { $t } from '@igourd/locales';

async function initSetupIgourdForm() {
  setupIgourdForm<ComponentType>({
    config: {
      // naive-ui组件的空值为null,不能是undefined，否则重置表单时不生效
      emptyStateValue: null,
      baseModelPropName: 'value',
      modelPropNameMap: {
        Checkbox: 'checked',
        Radio: 'checked',
        Upload: 'fileList',
      },
    },
    defineRules: {
      required: (value, _params, ctx) => {
        if (value === undefined || value === null || value.length === 0) {
          return $t('ui.formRules.required', [ctx.label]);
        }
        return true;
      },
      selectRequired: (value, _params, ctx) => {
        if (value === undefined || value === null) {
          return $t('ui.formRules.selectRequired', [ctx.label]);
        }
        return true;
      },
    },
  });
}

const useIgourdForm = useForm<ComponentType>;

export { initSetupIgourdForm, useIgourdForm, z };

export type IgourdFormSchema = FormSchema<ComponentType>;
export type { IgourdFormProps };
