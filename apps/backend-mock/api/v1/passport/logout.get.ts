import { defineEventHandler } from 'h3';
import { clearRefreshTokenCookie } from '~/utils/cookie-utils';
import { useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  // 清除refresh token cookie
  clearRefreshTokenCookie(event);

  // 返回成功响应
  return useResponseSuccess(true);
});
