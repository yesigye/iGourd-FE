<script lang="ts" setup>
import { computed, watch } from 'vue';

import { useWatermark } from '@igourd/hooks';
import { BasicLayout, UserDropdown } from '@igourd/layouts';
import { preferences } from '@igourd/preferences';
import { useUserStore } from '@igourd/stores';

import { useAuthStore } from '#/store';
// import LoginForm from '#/views/_core/authentication/login.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const menus = computed(() => []);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});
const { currentLoginUserApp } = userStore;

async function handleLogout() {
  await authStore.logout(false);
}
const roleChar = computed(() => {
  return currentLoginUserApp.roles
    .map((item: any) => {
      return item.name;
    })
    .join('/');
});
watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username} - ${userStore.userInfo?.realName}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
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
