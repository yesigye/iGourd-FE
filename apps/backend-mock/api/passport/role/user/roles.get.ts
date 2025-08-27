import { defineEventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { useResponseError, useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  // 验证token
  const user = verifyAccessToken(event);
  if (!user) {
    return useResponseError('Unauthorized', 'Invalid or expired token');
  }

  // 返回用户角色数组
  return useResponseSuccess(user.roles || []);
});
