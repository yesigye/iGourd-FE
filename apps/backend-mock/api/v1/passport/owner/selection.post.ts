import { defineEventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  generateNewJwtToken,
  generateFunctionTrees,
  generateUserApps,
  generateCurrentLoginUserApp,
} from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import { useResponseError, useResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  // 验证token
  const user = verifyAccessToken(event);
  if (!user) {
    return useResponseError('Unauthorized', 'Invalid or expired token');
  }

  // 读取请求参数
  const { owner_id, owner_type } = await readBody(event);

  if (!owner_id || !owner_type) {
    return useResponseError('BadRequestException', 'owner_id and owner_type are required');
  }

  // 查找用户
  const findUser = MOCK_USERS.find(item => item.username === user.username);
  if (!findUser) {
    return useResponseError('UserNotFound', 'User not found');
  }

  // 生成新的JWT Token
  const jwtToken = generateNewJwtToken(findUser);

  // 生成功能权限树
  const functionTrees = generateFunctionTrees(findUser.username);

  // 生成用户应用关系
  const userApps = generateUserApps(findUser.username);

  // 生成当前登录应用（基于选择的owner）
  const currentLoginUserApp = {
    id: Date.now(),
    owner_id,
    owner_type,
    app_key: 'MERCHANT_MANAGE_WEB_PC',
  };

  // 返回新的登录响应结构
  return useResponseSuccess({
    jwt_token: jwtToken,
    user_model: {
      id: findUser.id,
      real_name: findUser.realName,
      login_id: findUser.username,
      email: findUser.email,
      phone_number: findUser.phoneNumber,
      status: findUser.status,
    },
    function_trees: functionTrees,
    user_apps: userApps,
    current_login_user_app: currentLoginUserApp,
  });
});
