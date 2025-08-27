import type { EventHandlerRequest, H3Event } from 'h3';

import type { UserInfo, JwtToken, FunctionTree, UserApp } from './mock-data';

import { getHeader } from 'h3';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { MOCK_USERS, MOCK_FUNCTION_TREES, MOCK_USER_APPS } from './mock-data';

// TODO: Replace with your own secret key
const ACCESS_TOKEN_SECRET = 'access_token_secret';
const REFRESH_TOKEN_SECRET = 'refresh_token_secret';

export interface UserPayload extends UserInfo {
  iat: number;
  exp: number;
}

export function generateAccessToken(user: UserInfo) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(user: UserInfo) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
}

// 新增：生成新的JWT Token结构
export function generateNewJwtToken(user: UserInfo): JwtToken {
  const token = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
  return {
    jwt_token: token,
    token_id: uuidv4(),
    token_type: 'Bearer',
    expires_in: 7 * 24 * 60 * 60, // 7天，单位：秒
  };
}

// 新增：生成功能权限树
export function generateFunctionTrees(username: string): FunctionTree[] {
  return MOCK_FUNCTION_TREES[username] || [];
}

// 新增：生成用户应用关系
export function generateUserApps(username: string): UserApp[] {
  return MOCK_USER_APPS[username] || [];
}

// 新增：生成当前登录应用
export function generateCurrentLoginUserApp(username: string): UserApp {
  const userApps = generateUserApps(username);
  // 默认选择第一个应用，或者根据app_key选择
  return userApps.find(app => app.app_key === 'MERCHANT_MANAGE_WEB_PC') || userApps[0];
}

export function verifyAccessToken(
  event: H3Event<EventHandlerRequest>,
): null | Omit<UserInfo, 'password'> {
  const authHeader = getHeader(event, 'Authorization');
  if (!authHeader?.startsWith('Bearer')) {
    return null;
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2) {
    return null;
  }
  const token = tokenParts[1] as string;
  try {
    const decoded = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET,
    ) as unknown as UserPayload;

    const username = decoded.username;
    const user = MOCK_USERS.find((item) => item.username === username);
    if (!user) {
      return null;
    }
    const { password: _pwd, ...userinfo } = user;
    return userinfo;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(
  token: string,
): null | Omit<UserInfo, 'password'> {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as UserPayload;
    const username = decoded.username;
    const user = MOCK_USERS.find(
      (item) => item.username === username,
    ) as UserInfo;
    if (!user) {
      return null;
    }
    const { password: _pwd, ...userinfo } = user;
    return userinfo;
  } catch {
    return null;
  }
}
