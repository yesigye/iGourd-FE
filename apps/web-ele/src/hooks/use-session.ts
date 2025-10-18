import { useUserStore } from '@igourd/stores';

import { useAppStore, useAuthStore } from '#/store';

interface SessionOptions {
  token_id: string;
  user_id: string;
  owner_id: string;
  owner_type: string;
  app_id: string;
  app_key: string;
}

export function useSession() {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const appStore = useAppStore();
  async function setSession(options?: Partial<SessionOptions>) {
    const { token_id, app_key, app_id, user_id, owner_id, owner_type } =
      options ?? {};
    if (owner_id) {
      userStore.setUserInfo({
        current_login_user_app: {
          app_key,
          app_id,
          owner_id,
          owner_type,
          user_id,
        },
        jwt_token: { token_id },
      });
    }
    const { function_trees } = await authStore.fetchUserInfo();
    await authStore.fetchCollect(function_trees);
    await appStore.fetchApps();
  }
  return { setSession };
}
