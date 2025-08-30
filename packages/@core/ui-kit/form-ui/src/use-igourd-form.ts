import type { IFormProps } from '@formily/core';

import type { IGourdFormProps } from './types';

import { computed, defineComponent, h, watch } from 'vue';

import { registerValidateLocale } from '@formily/core';
import { observable } from '@formily/reactive';
import { createSchemaField, FormProvider } from '@formily/vue';

import { useForm } from './form-api';
import { getFormComponents } from './store';

registerValidateLocale({
  'zh-CN': { required: '{{ field.title }}是必填的' },
  'en-US': { required: '{{ field.title }} field is Required' },
}); // 初始化表单校验国际化

export function useIgourdForm<T extends object>(options: IGourdFormProps<T>) {
  const { formAPI } = useForm(options as IFormProps<object>);
  const components = getFormComponents();
  const { t, locale } = options.useI18n() as any;
  const $locale = computed(() => locale.value);
  const $i18n = observable({ lang: $locale.value });

  const tReactive = (...args: any[]) => {
    // 这行访问会被 Formily 的 reactive 捕获为依赖
    // （不用返回值，只需“读一下”）

    $i18n.lang;
    return t(...args) as string;
  };
  watch(
    () => locale.value,
    (val) => {
      $i18n.lang = val;
    },
  );
  const { SchemaField } = createSchemaField({
    components,
    scope: { t: tReactive, $i18n },
  });

  const Form = defineComponent(
    (props: Omit<IGourdFormProps<T>, 'i18n' | 'schema'>, { attrs }) => {
      return () =>
        h(FormProvider, { form: formAPI, ...props, ...attrs }, () =>
          h(SchemaField, {
            schema: options.schema,
            key: `i18n:${$i18n.lang}`,
          }),
        );
    },
    {
      name: 'IgourdForm',
      inheritAttrs: false,
    },
  );
  return { formAPI, Form };
}
