<script lang="ts" setup>
import { ElConfigProvider } from '@igourd/common-ui';
import { useElementPlusDesignTokens } from '@igourd/hooks';

import { elementLocale } from '#/locales';

defineOptions({ name: 'App' });

useElementPlusDesignTokens();
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <RouterView />
  </ElConfigProvider>
</template>
