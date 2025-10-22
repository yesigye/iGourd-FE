<script lang="ts" setup>
import { computed } from 'vue';

import { AuthPageLayout } from '@igourd/layouts';
import { preferences } from '@igourd/preferences';

import { $t } from '#/locales';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="logo"
    :page-description="$t('authentication.page-desc')"
    :page-title="$t('authentication.page-title')"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
