import type { Component, PropType } from 'vue';

import type { SlotTypes } from '../__builtins__/shared';

import { defineComponent, h } from 'vue';

import { connect, mapProps, mapReadPretty } from '@formily/vue';
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from 'element-plus';

import {
  composeExport,
  resolveComponent,
  transformComponent,
} from '../__builtins__/shared';
import { PreviewText } from '../preview-text';

type ElCheckboxProps = Omit<typeof ElCheckbox, 'value'> & {
  value: ElCheckboxProps['label'];
};

export interface CheckboxProps extends ElCheckboxProps {
  option: Omit<typeof ElCheckbox, 'value'> & {
    label: SlotTypes;
    value: ElCheckboxProps['label'];
  };
}

const CheckboxOption = defineComponent({
  name: 'FCheckbox',
  inheritAttrs: false,
  props: {
    option: {
      type: Object,
      default: null,
    },
  },
  setup(curtomProps, { attrs, slots }) {
    return () => {
      const props = attrs as unknown as CheckboxProps;
      const option = curtomProps?.option;
      if (option) {
        const children = {
          default: () => [
            resolveComponent(slots.default ?? option.label, { option }),
          ],
        };
        const newProps = {} as Partial<ElCheckboxProps>;
        Object.assign(newProps, option);
        newProps.label = option.value;
        delete newProps.value;

        return h(
          attrs.optionType === 'button' ? ElCheckboxButton : ElCheckbox,
          {
            ...newProps,
          },
          children,
        );
      }

      return h(
        ElCheckbox,
        {
          ...props,
        },
        slots,
      );
    };
  },
});

export type CheckboxGroupProps = typeof ElCheckboxGroup & {
  options?: Array<CheckboxProps | string>;
  optionType: 'button' | 'default';
  value: any[];
};

const TransformElCheckboxGroup = transformComponent(ElCheckboxGroup, {
  change: 'update:modelValue',
});

const CheckboxGroupOption: Component = defineComponent({
  name: 'FCheckboxGroup',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    optionType: {
      type: String as PropType<CheckboxGroupProps['optionType']>,
      default: 'default',
    },
  },
  setup(customProps, { attrs, slots }) {
    return (): any => {
      const options = customProps.options || [];
      const children =
        options.length > 0
          ? {
              default: () =>
                options.map((option) => {
                  return typeof option === 'string'
                    ? h(
                        Checkbox,
                        {
                          option: {
                            label: option,
                            value: option,
                          },
                          optionType: customProps.optionType,
                        },
                        slots?.option
                          ? { default: () => slots.option({ option }) }
                          : {},
                      )
                    : h(
                        Checkbox as any,
                        {
                          option,
                          optionType: customProps.optionType,
                        },
                        slots?.option
                          ? { default: () => slots.option({ option }) }
                          : {},
                      );
                }),
            }
          : slots;
      return h(
        TransformElCheckboxGroup,
        {
          ...attrs,
        },
        children,
      );
    };
  },
});

const CheckboxGroup = connect(
  CheckboxGroupOption,
  mapProps({ dataSource: 'options', value: 'modelValue' }),
  mapReadPretty(PreviewText.Select, {
    multiple: true,
  }),
);

const InnerCheckbox = connect(
  CheckboxOption,
  mapProps({
    value: 'modelValue',
  }),
);

export const Checkbox = composeExport(InnerCheckbox, {
  Group: CheckboxGroup,
});

export default Checkbox;
