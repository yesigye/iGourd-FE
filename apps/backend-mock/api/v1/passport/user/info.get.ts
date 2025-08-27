import { defineEventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { useResponseError, useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  // 验证token
  const user = verifyAccessToken(event);
  if (!user) {
    return useResponseError('Unauthorized', 'Invalid or expired token');
  }

  // 返回用户信息
  return useResponseSuccess({
    id: user.id,
    realName: user.realName,
    roles: user.roles,
    username: user.username,
    homePath: user.homePath,
    email: user.email,
    phoneNumber: user.phoneNumber,
    status: user.status,
  });
});
