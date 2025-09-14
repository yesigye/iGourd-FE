import { Upload } from '@igourd/common-ui';
import type { UploadProps } from '@igourd/common-ui';
import type { SetupContext } from 'vue';
import { h, mergeProps } from 'vue';
import { upload } from '#/api/upload';

export function UploadFiles(
  props: UploadProps,
  { attrs, slots }: Omit<SetupContext, 'expose'>,
) {
  const merged = mergeProps(props, { httpRequest: upload }, attrs);
  return h(Upload, merged, slots);
}

export default UploadFiles;
