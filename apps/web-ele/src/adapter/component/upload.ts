import type { SetupContext } from 'vue';

import type { UploadProps } from '@igourd/common-ui';

import { h, mergeProps } from 'vue';

import { Upload } from '@igourd/common-ui';

import { upload } from '#/api/upload';

export function UploadFiles(
  props: UploadProps,
  { attrs, slots }: Omit<SetupContext, 'expose'>,
) {
  const merged = mergeProps(props, { httpRequest: upload }, attrs);
  return h(Upload, merged, slots);
}

export default UploadFiles;
