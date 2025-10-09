import { connect, mapProps } from '@formily/vue';

import InnerPeriodPick from './pick.vue';

export const PeriodPick = connect(
  InnerPeriodPick,
  mapProps({
    value: 'modelValue',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    change: 'onUpdate:modelValue',
  }),
);
