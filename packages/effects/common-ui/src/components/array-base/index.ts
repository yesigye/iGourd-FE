/* eslint-disable vue/no-ref-as-operand */
/* eslint-disable unicorn/prefer-spread */
/* eslint-disable vue/require-default-prop */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/one-component-per-file */
import type { ArrayField } from '@formily/core';
import type { Schema } from '@formily/json-schema';
import type { ButtonProps as ElButtonProps } from 'element-plus';

import type { InjectionKey, PropType, Ref } from 'vue';

import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  toRefs,
} from 'vue';

// import { HandleDirective } from 'vue-slicksort'
import {
  ArrowDown,
  ArrowUp,
  Delete,
  Plus,
  Rank,
} from '@element-plus/icons-vue';
import { clone, isValid, uid } from '@formily/shared';
import { FragmentComponent, useField, useFieldSchema } from '@formily/vue';
import { ElButton } from 'element-plus';

import { stylePrefix } from '../__builtins__/configs';
import { composeExport } from '../__builtins__/shared';

export interface IArrayBaseAdditionProps extends ElButtonProps {
  title?: string;
  method?: 'push' | 'unshift';
  defaultValue?: any;
}

export type ArrayBaseMixins = {
  Addition?: typeof ArrayBaseAddition;
  Index?: typeof ArrayBaseIndex;
  MoveDown?: typeof ArrayBaseMoveDown;
  MoveUp?: typeof ArrayBaseMoveUp;
  Remove?: typeof ArrayBaseRemove;
  SortHandle?: typeof ArrayBaseSortHandle;
  useArray?: typeof useArray;
  useIndex?: typeof useIndex;
  useRecord?: typeof useRecord;
};

export interface IArrayBaseProps {
  disabled?: boolean;
  keyMap?: null | string[] | WeakMap<Record<string, unknown>, string>;
}

export interface IArrayBaseItemProps {
  index: number;
  record: any;
}

export interface IArrayBaseContext {
  field: Ref<ArrayField>;
  schema: Ref<Schema>;
  props: IArrayBaseProps;
  attrs: {
    [key in string]?: any;
  };
  keyMap?: null | string[] | WeakMap<Record<string, unknown>, string>;
}

const ArrayBaseSymbol: InjectionKey<IArrayBaseContext> =
  Symbol('ArrayBaseContext');
const ItemSymbol: InjectionKey<IArrayBaseItemProps> = Symbol('ItemContext');

export const useArray = () => {
  return inject(ArrayBaseSymbol, null);
};

export const useIndex = (index?: number) => {
  const { index: indexRef } = toRefs(inject(ItemSymbol) as IArrayBaseItemProps);
  return indexRef ?? ref(index);
};

export const useRecord = (record?: number) => {
  const { record: recordRef } = toRefs(
    inject(ItemSymbol) as IArrayBaseItemProps,
  );
  return recordRef ?? ref(record);
};

const isObjectValue: (schema: Schema) => boolean = (schema: Schema) => {
  // @ts-ignore
  if (Array.isArray(schema?.items)) return isObjectValue(schema.items[0]);

  if (schema?.items?.type === 'array' || schema?.items?.type === 'object') {
    return true;
  }
  return false;
};

const useKey = (schema: Schema) => {
  const isObject = isObjectValue(schema);
  let keyMap: null | string[] | WeakMap<Record<string, unknown>, string> = null;

  keyMap = isObject ? new WeakMap() : [];

  onBeforeUnmount(() => {
    keyMap = null;
  });

  return {
    keyMap,
    getKey: (record: any, index: number) => {
      if (keyMap instanceof WeakMap) {
        if (!keyMap.has(record)) {
          keyMap.set(record, uid());
        }
        return `${keyMap.get(record)}-${index}`;
      }

      if (keyMap && !keyMap[index]) {
        keyMap[index] = uid();
      }
      return keyMap ? `${keyMap[index]}-${index}` : undefined;
    },
  };
};

const getDefaultValue = (defaultValue: any, schema: Schema): any => {
  if (isValid(defaultValue)) return clone(defaultValue);
  if (Array.isArray(schema?.items))
    // @ts-ignore
    return getDefaultValue(defaultValue, schema.items[0]);
  if (schema?.items?.type === 'array') return [];
  if (schema?.items?.type === 'boolean') return true;
  if (schema?.items?.type === 'date') return '';
  if (schema?.items?.type === 'datetime') return '';
  if (schema?.items?.type === 'number') return 0;
  if (schema?.items?.type === 'object') return {};
  if (schema?.items?.type === 'string') return '';
  return null;
};

const ArrayBaseInner = defineComponent({
  name: 'ArrayBase',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    keyMap: {
      type: [WeakMap, Array] as PropType<
        string[] | WeakMap<Record<string, unknown>, string>
      >,
    },
  },
  setup(props, { slots, attrs }) {
    const field = useField<ArrayField>();
    const schema = useFieldSchema();

    provide(ArrayBaseSymbol, {
      field,
      schema,
      props,
      attrs,
      keyMap: props.keyMap,
    });
    return () => {
      return h(FragmentComponent, {}, slots);
    };
  },
});

const ArrayBaseItem = defineComponent({
  name: 'ArrayBaseItem',
  props: ['index', 'record'],
  setup(props: IArrayBaseItemProps, { slots }) {
    provide(ItemSymbol, props);
    return () => {
      return h(FragmentComponent, {}, slots);
    };
  },
});

const ArrayBaseSortHandle = defineComponent({
  name: 'ArrayBaseSortHandle',
  props: ['index'],
  setup(_, { attrs }) {
    const array = useArray();
    const prefixCls = `${stylePrefix}-array-base`;

    return () => {
      if (!array) return null;
      if (array.field.value?.pattern !== 'editable') return null;

      return h(
        ElButton,
        {
          directives: [{ name: 'handle' }],
          size: 'small',
          type: 'text',
          icon: Rank,
          ...attrs,
          class: [`${prefixCls}-sort-handle`].concat(attrs.class as any),
        },
        {},
      );
    };
  },
});

const ArrayBaseIndex = defineComponent({
  name: 'ArrayBaseIndex',
  setup(_, { attrs }) {
    const index = useIndex();
    const prefixCls = `${stylePrefix}-array-base`;
    return () => {
      return h(
        'span',
        {
          class: `${prefixCls}-index`,
          ...attrs,
        },
        {
          // @ts-ignore
          default: () => `${index.value + 1}.`,
        },
      );
    };
  },
});

const ArrayBaseAddition = defineComponent({
  name: 'ArrayBaseAddition',
  props: ['method', 'defaultValue', 'title'],
  setup(props, { attrs }) {
    const self = useField();
    const array = useArray();
    return () => {
      if (!array) return null;
      if (array?.field.value.pattern !== 'editable') return null;
      return h(
        ElButton,
        {
          ...attrs,
          ...props,
          icon: Plus,
          size: 'small',
          type: 'text',
          onClick: (e) => {
            if (array.props?.disabled) return;
            const defaultValue = getDefaultValue(
              props.defaultValue,
              array?.schema.value,
            );
            if (props.method === 'unshift') {
              array?.field?.value.value.unshift(defaultValue);
              array.attrs?.add?.(0);
            } else {
              array?.field?.value.value.push(defaultValue);
              array.attrs?.add?.(array?.field?.value?.value?.length - 1);
            }
            if (typeof attrs.onClick === 'function') {
              attrs.onClick(e);
            }
          },
        },
        {
          default: () => [self.value.title || props.title],
        },
      );
    };
  },
});

const ArrayBaseRemove = defineComponent<
  ElButtonProps & { index?: number; title?: string }
>({
  name: 'ArrayBaseRemove',
  setup(props, { attrs }) {
    const indexRef = useIndex(props.index);
    const base = useArray();
    const prefixCls = `${stylePrefix}-array-base`;
    return () => {
      const self = useField();
      if (base?.field.value.pattern !== 'editable') return null;
      return h(
        ElButton,
        {
          class: `${prefixCls}-remove`,
          type: 'text',
          size: 'small',
          icon: Delete,
          ...attrs,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            if (Array.isArray(base?.keyMap)) {
              // @ts-ignore
              base?.keyMap?.splice(indexRef.value, 1);
            }
            // @ts-ignore
            base?.field.value.remove(indexRef.value as number);
            // @ts-ignore
            base?.attrs?.remove?.(indexRef.value as number);

            if (typeof attrs.onClick === 'function') {
              attrs.onClick(e);
            }
          },
        },
        {
          default: () => [self.value.title || props.title],
        },
      );
    };
  },
});

const ArrayBaseMoveDown = defineComponent<
  ElButtonProps & { index?: number; title?: string }
>({
  name: 'ArrayBaseMoveDown',
  setup(props, { attrs }) {
    const indexRef = useIndex(props.index);
    const base = useArray();
    const prefixCls = `${stylePrefix}-array-base`;
    return () => {
      if (base?.field.value.pattern !== 'editable') return null;
      return h(
        ElButton,
        {
          class: `${prefixCls}-move-down`,
          size: 'small',
          type: 'text',
          icon: ArrowDown,
          ...attrs,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            if (Array.isArray(base?.keyMap)) {
              base.keyMap.splice(
                // @ts-ignore
                indexRef.value + 1,
                0,
                // @ts-ignore
                base.keyMap.splice(indexRef.value, 1)[0],
              );
            }
            // @ts-ignore
            base?.field.value.moveDown(indexRef.value as number);
            // @ts-ignore
            base?.attrs?.moveDown?.(indexRef.value as number);

            if (typeof attrs.onClick === 'function') {
              attrs.onClick(e);
            }
          },
        },
        {
          default: () => [props.title],
        },
      );
    };
  },
});

const ArrayBaseMoveUp = defineComponent<
  ElButtonProps & { index?: number; title?: string }
>({
  name: 'ArrayBaseMoveUp',
  setup(props, { attrs }) {
    const indexRef = useIndex(props.index);
    const base = useArray();
    const prefixCls = `${stylePrefix}-array-base`;
    return () => {
      if (base?.field.value.pattern !== 'editable') return null;
      return h(
        ElButton,
        {
          class: `${prefixCls}-move-up`,
          size: 'small',
          type: 'text',
          icon: ArrowUp,
          ...attrs,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            if (Array.isArray(base?.keyMap)) {
              base.keyMap.splice(
                // @ts-ignore
                indexRef.value - 1,
                0,
                // @ts-ignore
                base.keyMap.splice(indexRef.value, 1)[0],
              );
            }
            // @ts-ignore
            base?.field.value.moveUp(indexRef.value as number);
            // @ts-ignore
            base?.attrs?.moveUp?.(indexRef.value as number);

            if (typeof attrs.onClick === 'function') {
              attrs.onClick(e);
            }
          },
        },
        {
          default: () => [props.title],
        },
      );
    };
  },
});

export const ArrayBase = composeExport(ArrayBaseInner, {
  Index: ArrayBaseIndex,
  Item: ArrayBaseItem,
  SortHandle: ArrayBaseSortHandle,
  Addition: ArrayBaseAddition,
  Remove: ArrayBaseRemove,
  MoveDown: ArrayBaseMoveDown,
  MoveUp: ArrayBaseMoveUp,
  useArray,
  useIndex,
  useKey,
  useRecord,
});
