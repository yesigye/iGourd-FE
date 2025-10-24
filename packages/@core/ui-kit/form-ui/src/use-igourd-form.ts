import type { IFormProps } from '@formily/core';
import type { ISchema } from '@formily/vue';

import type { IGourdFormProps } from './types';
import { setValidateLanguage } from '@formily/core';
import { computed, defineComponent, h, renderSlot, watch } from 'vue';

import { registerValidateLocale, registerValidateRules } from '@formily/core';
import { observable } from '@formily/reactive';
import { createSchemaField, FormProvider } from '@formily/vue';

import { useForm } from './form-api';
import { getFormComponents } from './store';

registerValidateLocale({
  'zh-CN': {
    pattern: '该字段不是一个合法的字段',
    required: '该字段是必填字段',
    number: '该字段不是合法的数字',
    integer: '该字段不是合法的整型数字',
    url: '该字段不是合法的url',
    email: '该字段不是合法的邮箱格式',
    ipv6: '该字段不是合法的ipv6格式',
    ipv4: '该字段不是合法的ipv4格式',
    idcard: '该字段不是合法的身份证格式',
    taodomain: '该字段不符合淘系域名规则',
    qq: '该字段不符合QQ号格式',
    phone: '该字段不是有效的手机号',
    money: '该字段不是有效货币格式',
    zh: '该字段不是合法的中文字符串',
    date: '该字段不是合法的日期格式',
    zip: '该字段不是合法的邮编格式',
    len: '长度或条目数必须为{{len}}',
    min: '长度或条目数不能小于{{min}}',
    max: '长度或条目数不能大于{{max}}',
    maximum: '数值不能大于{{maximum}}',
    exclusiveMaximum: '数值必须小于{{exclusiveMaximum}}',
    minimum: '数值不能小于{{minimum}}',
    exclusiveMinimum: '数值必须大于{{exclusiveMinimum}}',
    whitespace: '不能为纯空白字符串',
  },
  'en-US': {
    pattern: 'This field  does not match any pattern',
    required: 'This field is required',
    number: 'This field is not a number',
    integer: 'This field is not an integer number',
    url: 'This field is a invalid url',
    email: 'This field is not a email format',
    ipv6: 'This field is not a ipv6 format',
    ipv4: 'This field is not a ipv4 format',
    idcard: 'This field is not an idcard format',
    taodomain: 'This field is not a taobao domain format',
    qq: 'This field is not a qq number format',
    phone: 'This field is not a phone number format',
    money: 'This field is not a currency format',
    zh: 'This field is not a chinese string',
    date: 'This field is not a valid date format',
    zip: 'This field is not a zip format',
    len: 'The length or number of entries must be {{len}}',
    min: 'The length or number of entries must be at least {{min}}',
    maximum: 'The value cannot be greater than {{maximum}}',
    exclusiveMaximum: 'The value must be less than {{exclusiveMaximum}}',
    minimum: 'The value cannot be less than {{minimum}}',
    exclusiveMinimum: 'The value must be greater than {{exclusiveMinimum}}',
    max: 'The length or number of entries must be at most {{max}}',
    whitespace: 'This field cannot be blank string.',
  },
  'fr-FR': {
    pattern: "Ce champ n'est pas valide",
    required: 'Ce champ est obligatoire',
    number: "Ce champ n'est pas un nombre valide",
    integer: "Ce champ n'est pas un entier valide",
    url: "Ce champ n'est pas une URL valide",
    email: "Ce champ n'est pas une adresse email valide",
    ipv6: "Ce champ n'est pas une adresse IPv6 valide",
    ipv4: "Ce champ n'est pas une adresse IPv4 valide",
    idcard: "Ce champ n'est pas un numéro de carte d'identité valide",
    taodomain: 'Ce champ ne respecte pas les règles de domaine Tao',
    qq: "Ce champ n'est pas un numéro QQ valide",
    phone: "Ce champ n'est pas un numéro de téléphone valide",
    money: "Ce champ n'est pas un format monétaire valide",
    zh: "Ce champ n'est pas une chaîne de caractères chinois valide",
    date: "Ce champ n'est pas un format de date valide",
    zip: "Ce champ n'est pas un code postal valide",
    len: "La longueur ou le nombre d'éléments doit être {{len}}",
    min: "La longueur ou le nombre d'éléments ne peut être inférieur à {{min}}",
    max: "La longueur ou le nombre d'éléments ne peut être supérieur à {{max}}",
    maximum: 'La valeur ne peut être supérieure à {{maximum}}',
    exclusiveMaximum:
      'La valeur doit être strictement inférieure à {{exclusiveMaximum}}',
    minimum: 'La valeur ne peut être inférieure à {{minimum}}',
    exclusiveMinimum:
      'La valeur doit être strictement supérieure à {{exclusiveMinimum}}',
    whitespace:
      "Ne peut pas être une chaîne vide ou composée uniquement d'espaces",
  },
}); // 初始化表单校验国际化

registerValidateRules({
  custom(value) {
    return value > 100 ? 'error' : '';
  },
});

export function useIgourdForm<T extends object>(options: IGourdFormProps<T>) {
  const { formAPI } = useForm(options as IFormProps<object>);
  const components = getFormComponents();
  // @ts-ignore
  const { t, locale } = options.useI18n() as any;
  const $locale = computed(() => locale.value);
  const $i18n = observable({ lang: $locale.value });
  setValidateLanguage($locale.value);

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
