/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { SetupContext } from 'vue';

import type { ReceiptTemplateProps } from '@igourd/common-ui';

import { h, mergeProps } from 'vue';

import { ReceiptTemplate as InnerReceiptTemplate } from '@igourd/common-ui';

import { getPrintTemplateOptionList } from '@@/setting/apis';

export function ReceiptTemplate(
  props: ReceiptTemplateProps,
  { attrs, slots }: Omit<SetupContext, 'expose'>,
) {
  const merged = mergeProps(
    props,
    { getCustomTemplateOptionList: getPrintTemplateOptionList },
    attrs,
  );
  // @ts-ignore
  return h(InnerReceiptTemplate, merged, slots);
}

export { useReceiptTemplate } from '@igourd/hooks';
