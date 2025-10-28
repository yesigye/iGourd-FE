<script lang="ts" setup>
import { computed, unref } from 'vue';

import { useAccess } from '@igourd/access';
import { Page } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

defineOptions({
  name: 'EmployeeList',
});

const { locale } = useI18n();

const { userModel, merchantInfo, currentLoginUserApp } = useUserStore();

const microAppData = computed(() => {
  return {
    language: unref(locale.value),
    userModel: unref(userModel),
    merchantInfo: unref(merchantInfo),
    currentLoginUserApp: unref(currentLoginUserApp),
    hasPermission: useAccess().hasAccessByCode,
  };
});

// @ts-ignore
const url = `${import.meta.env.VITE_APP_PASSPORT_URL}/employee`;
</script>

<template>
  <Page auto-content-height>
    <micro-app name="employee" :data="microAppData" iframe :url="url" />
  </Page>
</template>
