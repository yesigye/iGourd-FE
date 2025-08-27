import { defineEventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MENUS } from '~/utils/mock-data';
import { useResponseError, useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  // 验证token
  const user = verifyAccessToken(event);
  if (!user) {
    return useResponseError('Unauthorized', 'Invalid or expired token');
  }

  // 查找用户的菜单
  const userMenus = MOCK_MENUS.find(item => item.username === user.username);
  
  // 返回菜单数组
  return useResponseSuccess(userMenus?.menus || []);
});
