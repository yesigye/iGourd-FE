<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useSystemSettings } from '@@/setting/hooks';

defineOptions({
  name: 'ISetting',
});

const { t } = useI18n();
const { settings, loading, loadSettings, saveSettings } = useSystemSettings();
</script>

<template>
  <Page auto-content-height>
    <div>
      <h1>{{ t('setting.title') }}</h1>
      <p>设置页面</p>
    </div>
  </Page>
</template>
