import {
  connect,
  mapProps,
  mapReadPretty,
  PreviewText,
} from '@igourd/common-ui';

import InnerProductCell from './product-cell.vue';
import InnerQuantityCell from './quantity-cell.vue';

export const ProductCell = connect(
  InnerProductCell,
  mapProps({
    value: 'modelValue',
    readOnly: 'readonly',
  }),
  mapReadPretty(PreviewText.Input),
);

export const QuantityCell = connect(
  InnerQuantityCell,
  mapProps({
    value: 'modelValue',
    readOnly: 'readonly',
    change: 'update:modelValue',
  }),
  mapReadPretty(PreviewText.Input),
);
