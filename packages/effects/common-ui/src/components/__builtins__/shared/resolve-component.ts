import type { DefineComponent } from 'vue';

import type { SlotTypes } from '.';

import { h, toRaw } from 'vue';

import { isVnode } from './utils';

export const resolveComponent = (
  child?: SlotTypes,
  props?: Record<string, any>,
) => {
  if (child) {
    if (typeof child === 'string' || typeof child === 'number') {
      return child;
    } else if (typeof child === 'function') {
      return (child as Function)(props);
    } else if (isVnode(child)) {
      return child;
    } else {
      return h(toRaw(child as DefineComponent), props);
    }
  }

  return null;
};
