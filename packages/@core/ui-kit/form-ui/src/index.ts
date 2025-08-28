// 导出 useFormilyForm Hook
// export { useFormilyForm } from './use-formily-form';

export { setupIgourdForm } from './config';

// 基于 Formily 的新版本 igourd-use-form 组件
// export { default as IgourdUseFormFormily } from './igourd-use-form-formily.vue';

export { default as IGourdFormily } from './igourd-formily.vue';

export type {
  BaseFormComponentType,
  ExtendedFormApi,
  IgourdFormProps,
  FormSchema as IgourdFormSchema,
} from './types';

export * from './use-igourd-form';

export * from '@formily/core';

// export * from '@formily/vue';

// export { default as IgourdForm } from './igourd-form.vue';
export * as z from 'zod';
