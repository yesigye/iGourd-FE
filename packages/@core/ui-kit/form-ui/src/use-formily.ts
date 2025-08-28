import type { IFormProps } from '@formily/core';

import { provide } from 'vue';

import { globalShareState } from '@igourd-core/shared/global-state';

import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/vue';

export function useFormily(options: IFormProps) {
  const form = createForm(options);
  provide(Symbol.for('igourd-form'), form);
  const components = globalShareState.getComponents();
  const { SchemaField } = createSchemaField({ components });

  return { FormProvider, SchemaField, form };
}
