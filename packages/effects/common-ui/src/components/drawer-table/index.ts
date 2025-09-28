import type { ModalProps } from '@igourd-core/popup-ui';

import { defineComponent, h } from 'vue';

interface ModalTableProps extends ModalProps {}

const InnerModal = defineComponent<Partial<ModalTableProps>>({
  props: {},
  setup(props, { attrs }) {
    return () => {
      return h(Modal, props);
    };
  },
});
