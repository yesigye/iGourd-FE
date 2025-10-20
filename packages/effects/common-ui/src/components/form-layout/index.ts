import type { InjectionKey, Ref, SetupContext } from 'vue';

import { defineComponent, inject, provide, ref, watch } from 'vue';

import { h } from '@formily/vue';

import { stylePrefix } from '../__builtins__';
import { useResponsiveFormLayout } from './useResponsiveFormLayout';

export type FormLayoutProps = {
  bordered?: boolean;
  breakpoints?: number[];
  className?: string;
  colon?: boolean;
  direction?: 'ltr' | 'rtl';
  feedbackLayout?: 'loose' | 'popover' | 'terse';
  fullness?: boolean;
  gridColumnGap?: number;
  gridRowGap?: number;
  inset?: boolean;
  labelAlign?: 'left' | 'right' | ('left' | 'right')[];
  labelCol?: number | number[];
  labelWidth?: number;
  labelWrap?: boolean;
  layout?:
    | 'horizontal'
    | 'inline'
    | 'vertical'
    | ('horizontal' | 'inline' | 'vertical')[];
  shallow?: boolean;
  size?: 'default' | 'large' | 'small';
  spaceGap?: number;
  tooltipLayout?: 'icon' | 'text';
  wrapperAlign?: 'left' | 'right' | ('left' | 'right')[];
  wrapperCol?: number | number[];
  wrapperWidth?: number;
  wrapperWrap?: boolean;
};

export const FormLayoutDeepContext: InjectionKey<Ref<FormLayoutProps>> = Symbol(
  'FormLayoutDeepContext',
);

export const FormLayoutShallowContext: InjectionKey<Ref<FormLayoutProps>> =
  Symbol('FormLayoutShallowContext');

export const useFormDeepLayout = (): Ref<FormLayoutProps> =>
  inject(FormLayoutDeepContext, ref({}));

export const useFormShallowLayout = (): Ref<FormLayoutProps> =>
  inject(FormLayoutShallowContext, ref({}));

export const useFormLayout = (): Ref<FormLayoutProps> => {
  const shallowLayout = useFormShallowLayout();
  const deepLayout = useFormDeepLayout();
  const formLayout = ref({
    ...deepLayout.value,
    ...shallowLayout.value,
  });

  watch(
    [shallowLayout, deepLayout],
    () => {
      formLayout.value = {
        ...deepLayout.value,
        ...shallowLayout.value,
      };
    },
    {
      deep: true,
    },
  );
  return formLayout;
};

export const FormLayout = defineComponent({
  name: 'FFormLayout',
  props: {
    className: {},
    colon: { default: true },
    labelAlign: {},
    wrapperAlign: {},
    labelWrap: { default: false },
    labelWidth: {},
    wrapperWidth: {},
    wrapperWrap: { default: false },
    labelCol: {},
    wrapperCol: {},
    fullness: { default: false },
    size: { default: 'small' },
    layout: { default: 'horizontal' },
    direction: { default: 'ltr' },
    shallow: { default: true },
    feedbackLayout: { default: 'terse' },
    tooltipLayout: {},
    bordered: { default: true },
    inset: { default: false },
    breakpoints: {},
    spaceGap: {},
    gridColumnGap: {},
    gridRowGap: {},
  },
  setup(customProps: any, { slots }: SetupContext) {
    const { props }: any = useResponsiveFormLayout(customProps as any);

    const deepLayout = useFormDeepLayout();
    const newDeepLayout = ref({
      ...deepLayout.value,
    });
    const shallowProps = ref({});
    watch(
      [props, deepLayout],
      () => {
        shallowProps.value = props.value.shallow ? props.value : undefined;
        if (props.value.shallow) {
          if (props.value.size > 0) {
            newDeepLayout.value.size = props.value.size;
          }
          if (props.value.colon) {
            newDeepLayout.value.colon = props.value.colon;
          }
        } else {
          Object.assign(newDeepLayout.value, props.value);
        }
      },
      { deep: true, immediate: true },
    );

    provide(FormLayoutDeepContext, newDeepLayout);
    provide(FormLayoutShallowContext, shallowProps);

    const formPrefixCls = `${stylePrefix}-form`;
    return () => {
      const classNames = {
        [`${formPrefixCls}-${props?.value.layout}`]: true,
        [`${formPrefixCls}-rtl`]: props?.value.direction === 'rtl',
        [`${formPrefixCls}-${props?.value.size}`]:
          props?.value.size !== undefined,
        [`${props?.value.className}`]: props?.value.className !== undefined,
      };
      return h(
        'div',
        {
          ref: 'root',
          class: classNames,
        },
        slots,
      );
    };
  },
});

export default FormLayout;
