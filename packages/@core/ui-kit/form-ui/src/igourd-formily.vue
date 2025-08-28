<script lang="ts" setup>
import type { IFormProps } from '@formily/core';
import type { ISchema } from '@formily/vue';

import { useFormily } from './use-formily';

interface IFormilyProps extends IFormProps {
  schema: ISchema;
}

const props = defineProps<IFormilyProps>();
const { FormProvider, form, SchemaField } = useFormily(props);
</script>
<template>
  <FormProvider :form="form">
    <SchemaField :schema="props.schema" />
  </FormProvider>
</template>
