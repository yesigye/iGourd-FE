<script lang="tsx" setup>
import { AuthenticationLogin } from '@igourd/common-ui';

import { useAuthStore } from '#/store';

import '@formily/element-plus/lib/select/style.js';
import '@formily/element-plus/lib/input/style.js';
import '@formily/element-plus/lib/password/style.js';

const authStore = useAuthStore();

const schema = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'Horizontal',
        className: '',
      },
      properties: {
        username: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-class': 'w-full',
          title: "{{ t('authentication.username') }}",
          'x-validator': [
            {
              required: true,
            },
          ],
        },
        password: {
          type: 'string',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Password',
          title: "{{ t('page.dashboard.title') }}",
          'x-validator': [
            {
              required: true,
            },
          ],
        },
      },
    },
  },
};
</script>
<template>
  <AuthenticationLogin
    :form-schema="schema as any"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
  />
</template>
