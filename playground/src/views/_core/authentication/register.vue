<script lang="ts" setup>
import type { IgourdFormSchema } from '@igourd/common-ui';
import type { Recordable } from '@igourd/types';

import { computed, h, ref } from 'vue';

import { AuthenticationRegister } from '@igourd/common-ui';
// import { z } from '@igourd/common-ui';
import { $t } from '@igourd/locales';

defineOptions({ name: 'Register' });

const loading = ref(false);

const formSchema = computed((): IgourdFormSchema[] => {
  return [
    {
      component: 'IgourdInput',
      componentProps: {
        placeholder: $t('authentication.username-tip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      // rules: z.string().min(1, { message: $t('authentication.username-tip') }),
    },
    {
      component: 'IgourdInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      renderComponentContent() {
        return {
          strengthText: () => $t('authentication.password-strength'),
        };
      },
      // rules: z.string().min(1, { message: $t('authentication.password-tip') }),
    },
    {
      component: 'IgourdInputPassword',
      componentProps: {
        placeholder: $t('authentication.confirm-password'),
      },
              // dependencies: {
        //   rules(values) {
        //     const { password } = values;
        //     return z
        //       .string({ required_error: $t('authentication.password-tip') })
        //       .min(1, { message: $t('authentication.password-tip') })
        //       .refine((value) => value === password, {
        //         message: $t('authentication.confirm-passwordTip'),
        //       });
        //   },
        //   triggerFields: ['password'],
        // },
      fieldName: 'confirmPassword',
      label: $t('authentication.confirm-password'),
    },
    {
      component: 'IgourdCheckbox',
      fieldName: 'agreePolicy',
      renderComponentContent: () => ({
        default: () =>
          h('span', [
            $t('authentication.agree'),
            h(
              'a',
              {
                class: 'igourd-link ml-1 ',
                href: '',
              },
              `${$t('authentication.privacy-policy')} & ${$t('authentication.terms')}`,
            ),
          ]),
      }),
      // rules: z.boolean().refine((value) => !!value, {
      //   message: $t('authentication.agree-tip'),
      // }),
    },
  ];
});

function handleSubmit(value: Recordable<any>) {
  // eslint-disable-next-line no-console
  console.log('register submit:', value);
}
</script>

<template>
  <AuthenticationRegister
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
