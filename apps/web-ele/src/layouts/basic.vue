<script lang="ts" setup>
import type { SupportedLanguagesType } from '@igourd/preferences';

import { computed } from 'vue';

import { SUPPORT_LANGUAGES } from '@igourd/constants';
import { BasicLayout, UserDropdown } from '@igourd/layouts';
import { loadLocaleMessages } from '@igourd/locales';
import { preferences, updatePreferences } from '@igourd/preferences';
import { useUserStore } from '@igourd/stores';

import { useAppStore, useAuthStore } from '#/store';

// import LoginForm from '#/views/_core/authentication/login.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const { apps } = useAppStore();

async function handleUpdate(value: string | undefined) {
  if (!value) return;
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  await loadLocaleMessages(locale);
}

const menus = computed(() => [
  {
    text: userStore.merchantInfo.full_name,
    icon: 'solar:shop-2-outline',
  },
  {
    handler(...args: any) {
      console.log(...args);
    },
    text: 'Switch Store',
    icon: 'solar:shop-2-outline',
    children: apps.map((app: any) => {
      return {
        ...app,
        disabled: app.merchant_id === userStore.merchantInfo.merchant_id,
        text: app.full_name,
        icon: 'solar:shop-2-outline',
      };
    }),
  },
  {
    handler: ({ value }: { value: string }) => handleUpdate(value),
    text: 'Switch Language',
    icon: 'majesticons:globe-grid-line',
    children: SUPPORT_LANGUAGES.map((item) => {
      return {
        text: item.label,
        value: item.value,
      };
    }),
  },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});
const { currentLoginUserApp } = userStore;
async function handleLogout() {
  await authStore.logout();
}
const roleChar = computed(() => {
  return currentLoginUserApp.roles
    .map((item: any) => {
      return item.name;
    })
    .join('/');
});
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :text="userStore.userInfo?.login_account"
        :description="roleChar"
        :tag-text="currentLoginUserApp.owner_name"
        @logout="handleLogout"
      />
    </template>
  </BasicLayout>
</template>
