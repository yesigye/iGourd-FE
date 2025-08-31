/* eslint-disable vue/one-component-per-file */
import type { DefineComponent, InjectionKey, Ref } from 'vue';

import { defineComponent, inject, provide, readonly, ref, toRef } from 'vue';

export type CreateContext<T> = {
  Consumer?: DefineComponent;
  injectKey: InjectionKey<Ref<T>>;
  Provider?: DefineComponent;
};

export const createContext = <T>(defaultValue?: T): CreateContext<T> => {
  // eslint-disable-next-line symbol-description
  const injectKey: InjectionKey<Ref<T>> = Symbol();

  return {
    Provider: defineComponent({
      name: 'ContextProvider',
      props: {
        value: {
          type: null,
          default() {
            return defaultValue ?? null;
          },
        },
      },
      setup(props, { slots }) {
        const value = toRef(props, 'value' as never);
        provide(injectKey, readonly(value as never));
        return () => slots?.default?.();
      },
    }),

    Consumer: defineComponent({
      name: 'ContextConsumer',
      setup(_props, { slots }) {
        const value = inject(injectKey);
        return () => slots?.default?.(value);
      },
    }),
    injectKey,
  };
};

export const useContext = <T>(context: CreateContext<T>) => {
  const key = context.injectKey;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return inject(key, ref(null));
};
