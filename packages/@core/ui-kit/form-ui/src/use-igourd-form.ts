import type { IFormProps } from '@formily/core';
import type { ISchema } from '@formily/vue';

import type { IGourdFormProps } from './types';

import { computed, defineComponent, h, renderSlot, watch } from 'vue';

import { registerValidateLocale,registerValidateRules } from '@formily/core';
import { observable } from '@formily/reactive';
import { createSchemaField, FormProvider } from '@formily/vue';

import { useForm } from './form-api';
import { getFormComponents } from './store';

registerValidateLocale({
  'zh-CN': { required: '{{ field.title }}是必填的' },
  'en-US': { required: '{{ field.title }} field is Required' },
}); // 初始化表单校验国际化

registerValidateRules({
  custom(value) {
    return value > 100 ? 'error' : ''
  },
})

export function useIgourdForm<T extends object>(options: IGourdFormProps<T>) {
  const { formAPI } = useForm(options as IFormProps<object>);
  const components = getFormComponents();
  // @ts-ignore
  const { t, locale } = options.useI18n() as any;
  const $locale = computed(() => locale.value);
  const $i18n = observable({ lang: $locale.value });

  const tReactive = (...args: any[]) => {
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
    scope: Object.assign({ t: tReactive, $i18n }, options.scope || {}),
  });

  const Form = defineComponent(
    (
      props: Partial<Omit<IGourdFormProps<T>, 'i18n' | 'scope'>>,
      { attrs, slots },
    ) => {
      return () =>
        h(FormProvider, { form: formAPI, ...props, ...attrs }, () => [
          h(SchemaField, {
            schema: props.schema ?? options.schema,
            key: `i18n:${$i18n.lang}`,
          }),
          renderSlot(slots, 'default'),
        ]);
    },
    {
      name: 'IgourdForm',
      inheritAttrs: false,
      props: {
        schema: {
          type: Object,
          required: false,
        },
      },
    },
  );
  return { formAPI, Form };
}

export type { IFormProps, IGourdFormProps };

export function useTableSearchForm<T extends object>(
  options: Omit<IGourdFormProps<T>, 'schema'> & {
    schema: ISchema['properties'];
  },
) {
  const schemaPolyfill = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          feedbackLayout: 'none',
          layout: 'inline',
          size: 'small',
        },
        properties: {
          space: {
            type: 'void',
            'x-component': 'Space',
            properties: options.schema,
          },
        },
      },
    },
  } as ISchema;

  return useIgourdForm({ ...options, schema: schemaPolyfill });
}
