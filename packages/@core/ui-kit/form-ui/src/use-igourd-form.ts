import type { IFormProps } from '@formily/core';
import type { ISchema } from '@formily/vue';

import type { IGourdFormProps } from './types';

import { computed, defineComponent, h, renderSlot, watch } from 'vue';

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
    scope: Object.assign({ t: tReactive, $i18n }, options.scope || {}),
  });

  const Form = defineComponent(
    (
      props: Partial<Omit<IGourdFormProps<T>, 'i18n' | 'schema' | 'scope'>>,
      { attrs, slots },
    ) => {
      return () =>
        h(FormProvider, { form: formAPI, ...props, ...attrs }, () => [
          h(SchemaField, {
            schema: options.schema,
            key: `i18n:${$i18n.lang}`,
          }),
          renderSlot(slots, 'default'),
        ]);
    },
    {
      name: 'IgourdForm',
      inheritAttrs: false,
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
  const actions = {
    type: 'void',
    'x-decorator': 'FormItem', // 保持和其他字段对齐
    'x-component': 'Space', // 或者 'FormButtonGroup'
    properties: {
      search: {
        type: 'void',
        'x-component': 'Submit',
        'x-content': {
          default: "{{ t('common.search') }}",
        },
        'x-component-props': {
          type: 'primary',
          onClick: () => {
            if (options.handleSubmit) {
              return options.handleSubmit();
            }
            throw new ReferenceError('unknown Submit Handler');
          },
        },
      },
      reset: {
        type: 'void',
        'x-component': 'Button',
        'x-component-props': {
          onClick: () => {
            if (options.handleReset) {
              return options.handleReset();
            }
            throw new ReferenceError('unknown Submit Handler');
          },
        },
        'x-content': {
          default: "{{ t('common.reset') }}",
        },
      },
    },
  };

  const copySchema = Object.assign({}, options.schema, {
    $actions: actions,
  }) as Record<string, any>;

  const schemaPolyfill = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: [2, 4, 6, 8, 12],
          breakpoints: [720, 1280, 1920, 2560, 3840],
        },
        properties: { ...copySchema },
      },
    },
  } as ISchema;

  return useIgourdForm({ ...options, schema: schemaPolyfill });
}
