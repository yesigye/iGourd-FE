import { useUserStore } from '@igourd/stores';

export function useAccount(options?: {
  confirm?: (register?: boolean) => Promise<any>;
}) {
  const userStore = useUserStore();

  async function redirectToLogin() {
    const jumpLoginUrl = location.pathname.includes('/401')
      ? location.origin
      : location.href;
    window.location.href = `${import.meta.env.VITE_APP_API_LOGIN_URL}?redirect=${encodeURIComponent(jumpLoginUrl)}`;
  }

  function logoutMessageTips(register?: 'register') {
    options?.confirm?.(register === 'register').then(() => {
      userStore.logout();
    });
  }
  return {
    redirectToLogin,
    logoutMessageTips,
  };
}
