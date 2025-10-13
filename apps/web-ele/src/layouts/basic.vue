<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { IgourdIcon, IgourdSpinner } from '@igourd/common-ui';
import { SUPPORT_LANGUAGES } from '@igourd/constants';
import { ChevronDown } from '@igourd/icons';
import { BasicLayout, UserDropdown } from '@igourd/layouts';
import { useI18n } from '@igourd/locales';
import { preferences } from '@igourd/preferences';
import { useUserStore } from '@igourd/stores';
import { now } from '@igourd/utils';

import { useSession } from '#/hooks/use-session';
import { updateLocale } from '#/locales';
import { useAppStore, useAuthStore } from '#/store';

const {
  userInfo,
  userModel,
  merchantInfo,
  currentLoginUserApp,
  userApps,
  tokenId,
} = useUserStore();
const authStore = useAuthStore();
const { apps } = useAppStore();
const { setSession } = useSession();
const { t } = useI18n();
const spinning = ref(false);
const nowTime = ref<string>('');
const menus = computed(() => [
  {
    text: merchantInfo.full_name,
    icon: 'solar:shop-2-outline',
  },
  {
    async handler({ merchant_id }: { merchant_id: string }) {
      const target = userApps.find((app) => app.owner_id === merchant_id);
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
          disabled: app.merchant_id === merchantInfo.merchant_id,
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
  return userModel?.profile_photo ?? preferences.app.defaultAvatar;
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
let timer: null | number = null;
onMounted(() => {
  timer = setInterval(() => {
    nowTime.value = now();
  }, 1000) as unknown as number;
});
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
  timer = null;
});
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <Teleport to="body">
        <IgourdSpinner :spinning="spinning" style="z-index: 99999" />
      </Teleport>
      <span class="text-muted-foreground text-sm">
        {{ nowTime }}
      </span>
      <IgourdIcon
        class="bg-primary-background-lighter text-muted-foreground ml-1 size-6 cursor-pointer rounded-sm p-1"
        icon="material-symbols:kid-star"
      />
      <UserDropdown
        :avatar
        :menus
        :tag-text="currentLoginUserApp.owner_name"
        @logout="handleLogout"
      >
        <div
          class="flex-center text-muted-foreground ml-1 flex h-full cursor-pointer flex-col content-start items-start px-2 text-sm font-semibold"
        >
          <div class="text-foreground mb-1 font-medium">
            {{ userModel.name }}
          </div>
          <div class="text-muted-foreground text-xs font-light">
            {{ userInfo.login_account }} / {{ roleChar }}
          </div>
        </div>
        <ChevronDown class="size-4" />
      </UserDropdown>
    </template>
  </BasicLayout>
</template>
