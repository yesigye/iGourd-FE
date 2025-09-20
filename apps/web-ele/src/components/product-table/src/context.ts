import { inject, provide } from 'vue';

const provideKey = Symbol.for('ProductContextKey');

export function useProductConext() {
  function provideContext(ctx: Record<string, unknown>) {
    provide(provideKey, ctx);
  }
  function useProductTableContext() {
    return inject(provideKey, {});
  }
  return { provideContext, useProductTableContext };
}
