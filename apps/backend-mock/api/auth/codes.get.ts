import { defineEventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_CODES } from '~/utils/mock-data';
import { useResponseError, useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  // 验证token
  const user = verifyAccessToken(event);
  if (!user) {
    return useResponseError('Unauthorized', 'Invalid or expired token');
  }

  // 查找用户的权限码
  const userCodes = MOCK_CODES.find(item => item.username === user.username);
  
  // 返回权限码数组
  return useResponseSuccess(userCodes?.codes || []);
});
