import { h } from 'vue';

import { connect, mapProps } from '@formily/vue';
import { ElCard } from 'element-plus';

import { stylePrefix } from '../__builtins__';
// @ts-ignore
const InnerElCard = (props, { slots, emit, attrs }) => {
  const innerProps = {
    ...props,
    shadow: props.shadow ?? 'never',
    class: props.bodyClass ?? 'mb-1',
    bodyClass: props.bodyClass ?? `border-0`,
    'header-class': props.headerClass ?? `${stylePrefix}-card-header`,
  };
  return h(ElCard, Object.assign({}, attrs, emit, innerProps), slots);
};
export const Card = connect(
  InnerElCard,
  mapProps({}, (props) => {
    return {
      ...props,
      shadow: props.shadow ?? 'never',
      class: props.bodyClass ?? 'mb-1',
      bodyClass: props.bodyClass ?? `border-0`,
      headerClass: props.headerClass ?? `${stylePrefix}-card-header`,
    };
  }),
);
