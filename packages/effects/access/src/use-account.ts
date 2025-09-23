export function useAccount() {
  async function redirectToLogin() {
    const jumpLoginUrl = location.pathname.includes('/401')
      ? location.origin
      : location.href;
    window.location.replace(
      `${import.meta.env.VITE_APP_API_LOGIN_URL}?redirect=${encodeURIComponent(jumpLoginUrl)}`,
    );
  }

  return {
    redirectToLogin,
  };
}
