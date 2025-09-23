export function useAccount() {
  async function redirectToLogin() {
    const jumpLoginUrl = location.pathname.includes('/401')
      ? location.origin
      : location.href;
    window.open(
      `${import.meta.env.VITE_APP_API_LOGIN_URL}?redirect=${encodeURIComponent(jumpLoginUrl)}`,
      '_self',
    );
    // window.location.href = `${import.meta.env.VITE_APP_API_LOGIN_URL}?redirect=${encodeURIComponent(jumpLoginUrl)}`;
  }

  return {
    redirectToLogin,
  };
}
