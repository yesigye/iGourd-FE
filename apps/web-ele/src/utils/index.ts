import type { App, Component } from 'vue';

export * from './eleValidate';
export * from './functions';
export * from './global';
export * from './language';
export * from './time';

interface EventShim {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
}
export type WithInstall<T> = EventShim &
  T & {
    install(app: App): void;
  };

export type CustomComponent = Component & { displayName?: string };

export function withInstall<T extends CustomComponent>(
  component: T,
  alias?: string,
) {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName;
    if (!compName) return;
    app.component(compName, component);
    if (alias) app.config.globalProperties[alias] = component;
  };
  return component as WithInstall<T>;
}
