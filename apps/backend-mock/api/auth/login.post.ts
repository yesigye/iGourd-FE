import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie-utils';
import { 
  generateAccessToken, 
  generateRefreshToken,
  generateNewJwtToken,
  generateFunctionTrees,
  generateUserApps,
  generateCurrentLoginUserApp,
} from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';
import {
  forbiddenResponse,
  useResponseError,
  useResponseSuccess,
} from '~/utils/response';

export default defineEventHandler(async (event) => {
  const { password, login_account, app_key, type } = await readBody(event);
  
  // 验证必填参数
  if (!password || !login_account || !app_key || !type) {
    setResponseStatus(event, 400);
    return useResponseError(
      'BadRequestException',
      'login_account, password, app_key and type are required',
    );
  }

  // 查找用户（支持username和login_account）
  const findUser = MOCK_USERS.find(
    (item) => (item.username === login_account || item.username === login_account) && item.password === password,
  );

  if (!findUser) {
    clearRefreshTokenCookie(event);
    return forbiddenResponse(event, 'Username or password is incorrect.');
  }

  // 生成新的JWT Token结构
  const jwtToken = generateNewJwtToken(findUser);
  const refreshToken = generateRefreshToken(findUser);

  // 生成功能权限树
  const functionTrees = generateFunctionTrees(findUser.username);
  
  // 生成用户应用关系
  const userApps = generateUserApps(findUser.username);
  
  // 生成当前登录应用
  const currentLoginUserApp = generateCurrentLoginUserApp(findUser.username);

  // 设置refresh token到cookie
  setRefreshTokenCookie(event, refreshToken);

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
