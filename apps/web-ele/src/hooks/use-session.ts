import { useAccessStore, useUserStore } from '@igourd/stores';

import { router } from '#/router';
import { generateAccess } from '#/router/access';
import { accessRoutes } from '#/router/routes';
import { useAppStore, useAuthStore } from '#/store';

interface SessionOptions {
  token_id: string;
  user_id: string;
  owner_id: string;
  owner_type: string;
}

export function useSession() {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const appStore = useAppStore();
  async function setSession(options?: Partial<SessionOptions>) {
    const { token_id, user_id, owner_id, owner_type } = options ?? {};
    if (owner_id) {
      userStore.setUserInfo({
        current_login_user_app: { owner_id, owner_type, user_id },
        jwt_token: { token_id },
      });
    }
    await authStore.fetchUserInfo();
    const { roles } = userStore.userInfo;
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      roles,
      router,
      // 则会在菜单中显示，但是访问会被重定向到403
      routes: accessRoutes,
    });
    accessStore.setAccessMenus(accessibleMenus);
    accessStore.setAccessRoutes(accessibleRoutes);
    await appStore.fetchApps();
  }
  return { setSession };
}
