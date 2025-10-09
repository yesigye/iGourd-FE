import { connect, mapProps } from '@formily/vue';
import { ElCard } from 'element-plus';

import { stylePrefix } from '../__builtins__';

export const Card = connect(
  ElCard,
  mapProps({}, (props) => {
    return {
      ...props,
      shadow: props.shadow ?? 'never',
      headerClass: props.headerClass ?? `${stylePrefix}-card-header`,
    };
  }),
);
