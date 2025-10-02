<script lang="ts" setup>
import { computed, ref } from 'vue';

import { IgourdSpinner } from '@igourd/common-ui';
import { MerchantStatus, SUPPORT_LANGUAGES } from '@igourd/constants';
import { BasicLayout, UserDropdown } from '@igourd/layouts';
import { useI18n } from '@igourd/locales';
import { preferences } from '@igourd/preferences';
import { useUserStore } from '@igourd/stores';

import { useSession } from '#/hooks/use-session';
import { updateLocale } from '#/locales';
import { useAppStore, useAuthStore } from '#/store';

// import LoginForm from '#/views/_core/authentication/login.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const { apps } = useAppStore();
const { setSession } = useSession();
const { t } = useI18n();
const { currentLoginUserApp, userApps, tokenId } = userStore;
const spinning = ref(false);
const menus = computed(() => [
  {
    text: userStore.merchantInfo.full_name,
    icon: 'solar:shop-2-outline',
  },
  {
    async handler({ merchant_id }: { merchant_id: string }) {
      const target = userApps.find(
        (app) =>
          app.owner_id === merchant_id && app.status === MerchantStatus.OPEN,
      );
      spinning.value = true;
      await setSession({ ...target, token_id: tokenId });
      window.location.reload();
    },
    text: t('common.switch.store'),
    icon: 'solar:shop-2-outline',
    children: apps
      .filter((app: any) => app.level !== 1)
      .map((app: any) => {
        return {
          ...app,
          disabled: app.merchant_id === userStore.merchantInfo.merchant_id,
          text: app.full_name,
          icon: 'solar:shop-2-outline',
        };
      }),
  },
  {
    handler: ({ value }: { value: string }) => updateLocale(value),
    text: t('common.switch.language'),
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
      <Teleport to="body">
        <IgourdSpinner :spinning="spinning" style="z-index: 99999" />
      </Teleport>
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
