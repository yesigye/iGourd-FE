import type { PrintOptions } from '../types';

import { PrintEngine } from '../core/engine';

type VueBinding = {
  instance?: any;
  value?:
    | (PrintOptions & {
        previewBeforeOpenCallback?: (vm?: any) => void;
        previewOpenCallback?: (vm?: any) => void;
      })
    | string;
};

const HANDLER_KEY = '__vue_print_handler__';

export const VuePrintPlugin = {
  directiveName: 'print',

  mounted(el: any, binding: VueBinding) {
    const vueInstance = (binding as any).instance;
    const handler = () => {
      let opts: PrintOptions = { standard: 'html5' };
      if (typeof binding.value === 'string') {
        opts.ids = binding.value as string;
      } else if (binding.value && typeof binding.value === 'object') {
        const v: any = binding.value;
        opts = {
          standard: 'html5',
          ...v,
        };
        if (v.previewBeforeOpenCallback) {
          const fn = v.previewBeforeOpenCallback;
          opts.previewBeforeOpenCallback = () => fn(vueInstance);
        }
        if (v.previewOpenCallback) {
          const fn = v.previewOpenCallback;
          opts.previewOpenCallback = () => fn(vueInstance);
        }
      } else {
        console.warn('[VuePrint] Invalid directive binding value.');
        return;
      }
      // eslint-disable-next-line no-new
      new PrintEngine(opts);
    };
    el.addEventListener('click', handler, false);
    el[HANDLER_KEY] = handler;
  },

  unmounted(el: any) {
    const handler = el[HANDLER_KEY];
    if (handler) el.removeEventListener('click', handler, false);
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete el[HANDLER_KEY];
  },

  install(App: any, options?: { directiveName?: string }) {
    const name =
      (options && options.directiveName) ||
      (VuePrintPlugin as any).directiveName ||
      'print';
    if (typeof App?.directive === 'function') {
      App.directive(name, VuePrintPlugin as any);
    } else {
      console.error('[VuePrint] Invalid Vue app passed to install().');
    }
  },
};
