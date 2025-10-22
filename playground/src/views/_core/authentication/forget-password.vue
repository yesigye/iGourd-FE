<script lang="ts" setup>
import type { IgourdFormSchema } from '@igourd/common-ui';

import { computed, ref } from 'vue';

import { AuthenticationForgetPassword, z } from '@igourd/common-ui';
import { $t } from '@igourd/locales';

defineOptions({ name: 'ForgetPassword' });

const loading = ref(false);

const formSchema = computed((): IgourdFormSchema[] => {
  return [
    {
      component: 'IgourdInput',
      componentProps: {
        placeholder: 'example@example.com',
      },
      fieldName: 'email',
      label: $t('authentication.email'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.email-tip') })
        .email($t('authentication.email-valid-error-tip')),
    },
  ];
});

function handleSubmit(value: Record<string, any>) {
  // eslint-disable-next-line no-console
  console.log('reset email:', value);
}
</script>

<template>
  <AuthenticationForgetPassword
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
