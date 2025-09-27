import { connect, mapProps } from '@formily/vue';

import InnerTransfer from './transfer.vue';

export const TransferTable = connect(
  InnerTransfer,
  mapProps({
    value: 'modelValue',
  }),
);
