import { defineEventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MENU_LIST } from '~/utils/mock-data';
import { useResponseError, useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  // 验证token
  const user = verifyAccessToken(event);
  if (!user) {
    return useResponseError('Unauthorized', 'Invalid or expired token');
  }

  // 读取请求参数
  const { app_key, menu_key, menu_names, menu_type, menu_status } = await readBody(event);

  // 过滤菜单数据
  let filteredMenus = MOCK_MENU_LIST;

  if (menu_key) {
    filteredMenus = filteredMenus.filter(menu => 
      menu.meta?.title?.toLowerCase().includes(menu_key.toLowerCase())
    );
  }

  if (menu_type) {
    filteredMenus = filteredMenus.filter(menu => menu.type === menu_type);
  }

  if (menu_status) {
    filteredMenus = filteredMenus.filter(menu => menu.status === 1); // 1表示有效状态
  }

  // 返回菜单树结构
  return useResponseSuccess(filteredMenus);
});
