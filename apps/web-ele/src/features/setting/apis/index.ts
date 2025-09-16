import { requestClient } from '#/api/request';

// 获取系统设置
export function getSystemSettingsApi() {
  return requestClient.get('/v1/merchant/settings/system');
}

// 更新系统设置
export function updateSystemSettingsApi(data: any) {
  return requestClient.post('/v1/merchant/settings/system', data);
}

// 获取用户设置
export function getUserSettingsApi() {
  return requestClient.get('/v1/merchant/settings/user');
}

// 更新用户设置
export function updateUserSettingsApi(data: any) {
  return requestClient.post('/v1/merchant/settings/user', data);
}

// Setting APIs
export * from './payment';
export * from './saleset';
export * from './storeset';
export * from './template';
