import type { IFormProps } from '@formily/core';

import { createForm } from '@formily/vue';

export function useForm(options?: IFormProps<object>) {
  const formAPI = createForm(options);
  return { formAPI };
}
