<script setup lang="ts">
import { ElCol, ElRow, Page } from '@igourd/common-ui';
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
    <ElRow>
      <ElCol :span="12"> 1 </ElCol>
    </ElRow>
  </Page>
</template>
