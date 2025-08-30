import type { Component } from 'vue';

import { setFormComponents } from './store';

export interface IgrourdFormOptions {
  components?: Record<string, Component>;
}

// export interface IGourdFromProps

export function setupIgourdForm(options?: IgrourdFormOptions) {
  const defaultComponents: Record<string, Component> = {};
  const components = Object.assign(
    defaultComponents,
    options?.components || {},
  );
  setFormComponents(components);
  return options;
}
