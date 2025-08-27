import type {
  BaseFormComponentType,
  ExtendedFormApi,
  IgourdFormProps,
} from './types';

import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue';

import { useStore } from '@igourd-core/shared/store';

import { FormApi } from './form-api';
import IgourdUseForm from './igourd-use-form.vue';

export function useIgourdForm<
  T extends BaseFormComponentType = BaseFormComponentType,
>(options: IgourdFormProps<T>) {
  const IS_REACTIVE = isReactive(options);
  const api = new FormApi(options);
  const extendedApi: ExtendedFormApi = api as never;
  extendedApi.useStore = (selector) => {
    return useStore(api.store, selector);
  };

  const Form = defineComponent(
    (props: IgourdFormProps, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      api.setState({ ...props, ...attrs });
      return () =>
        h(IgourdUseForm, { ...props, ...attrs, formApi: extendedApi }, slots);
    },
    {
      name: 'IgourdUseForm',
      inheritAttrs: false,
    },
  );
  // Add reactivity support
  if (IS_REACTIVE) {
    watch(
      () => options.schema,
      () => {
        api.setState({ schema: options.schema });
      },
      { immediate: true },
    );
  }

  return [Form, extendedApi] as const;
}
