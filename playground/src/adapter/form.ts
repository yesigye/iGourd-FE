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
      // ant design vue组件库默认都是 v-model:value
      baseModelPropName: 'value',
      // 一些组件是 v-model:checked 或者 v-model:fileList
      modelPropNameMap: {
        Checkbox: 'checked',
        Radio: 'checked',
        Switch: 'checked',
        Upload: 'fileList',
      },
    },
    defineRules: {
      // 输入项目必填国际化适配
      required: (value, _params, ctx) => {
        if (value === undefined || value === null || value.length === 0) {
          return $t('ui.formRules.required', [ctx.label]);
        }
        return true;
      },
      // 选择项目必填国际化适配
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
