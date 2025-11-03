import type { Ref } from 'vue';

import { onBeforeUnmount, watch } from 'vue';

export const useClickOutside = (
  visible: Ref<boolean>,
  ref: Ref<Element | null>,
  handler: (contains: boolean) => void,
) => {
  const handleClick = (event: MouseEvent) => {
    if (!ref?.value || !event.target) return;
    if (ref.value.contains(event.target as Node)) {
      handler(true);
    } else {
      handler(false);
    }
  };
  const listenerOpt = { capture: true };
  watch(visible, () => {
    if (visible.value) {
      setTimeout(() => {
        document.body.addEventListener('click', handleClick, listenerOpt);
      });
    } else {
      document.body.removeEventListener('click', handleClick, listenerOpt);
    }
  });

  onBeforeUnmount(() => {
    document.body.removeEventListener('click', handleClick, listenerOpt);
  });
};
