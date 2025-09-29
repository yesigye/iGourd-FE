import { connect, mapProps } from '@igourd/common-ui';

import ModalTable from './table.vue';

export default connect(
  ModalTable,
  mapProps({
    value: 'modelValue',
  }),
);
