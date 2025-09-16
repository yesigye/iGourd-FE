<script setup lang="ts">
import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

import { useHomeData, useHomeStats } from '@@/home/hooks';

defineOptions({
  name: 'IHome',
});

const { t } = useI18n();
const { homeData, loading, loadHomeData } = useHomeData();
const { stats, loading: statsLoading, loadStats } = useHomeStats();
</script>

<template>
  <Page auto-content-height>
    <div>
      <h1>{{ t('home.title') }}</h1>
      <p>首页</p>
    </div>
  </Page>
</template>
