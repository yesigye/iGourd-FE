import { requestClient } from '#/api/request';

// 获取客户分页列表
export function getCustomerPageListApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/page-list`, data);
}

// 获取客户列表
export function getCustomerListApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/list`, data);
}

// 获取客户详情
export function getCustomerDetailApi(id: string) {
  return requestClient.get(`/merchant/customer/customer/${id}`);
}

// 创建客户
export function createCustomerApi(data: any) {
  return requestClient.post(`/merchant/customer/customer`, data);
}

// 更新客户
export function updateCustomerApi(id: string, data: any) {
  return requestClient.put(`/merchant/customer/customer/${id}`, data);
}

// 删除客户
export function deleteCustomerApi(id: string) {
  return requestClient.delete(`/merchant/customer/customer/${id}`);
}

// 批量删除客户
export function batchDeleteCustomerApi(ids: string[]) {
  return requestClient.delete(`/merchant/customer/customer/batch`, { data: { ids } });
}

// 修改客户标签
export function updateCustomerTagApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/label/bind`, data);
}

// 获取账户余额详情
export function getBalanceDetailApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/balance-change-log/page-list`, data);
}

// 客户充值明细分页列表
export function getRechargeDetailListApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/recharge/list-page`, data);
}

// ==================== 客户账户管理 APIs ====================

// 获取客户账户列表
export function getAccountListApi(data: any) {
  return requestClient.post(`/merchant/customer/account/list`, data);
}

// 获取客户账户详情
export function getAccountDetailApi(id: string) {
  return requestClient.get(`/merchant/customer/account/${id}`);
}

// 创建客户账户记录
export function createAccountApi(data: any) {
  return requestClient.post(`/merchant/customer/account`, data);
}

// 更新客户账户记录
export function updateAccountApi(data: any) {
  return requestClient.put(`/merchant/customer/account/${data.id}`, data);
}

// 删除客户账户记录
export function deleteAccountApi(id: string) {
  return requestClient.delete(`/merchant/customer/account/${id}`);
}

// 批量删除客户账户记录
export function batchDeleteAccountApi(ids: string[]) {
  return requestClient.delete(`/merchant/customer/account/batch`, { data: { ids } });
}

// ==================== 客户权益设置 APIs ====================

// 获取客户权益设置
export function getEquitySettingsApi() {
  return requestClient.get(`/merchant/customer/equity/settings`);
}

// 更新客户权益设置
export function updateEquitySettingsApi(data: any) {
  return requestClient.put(`/merchant/customer/equity/settings`, data);
}

// ==================== 客户特性管理 APIs ====================

// 获取客户特性列表
export function getFeatureListApi(data: any) {
  return requestClient.post(`/merchant/customer/feature/list`, data);
}

// 获取客户特性详情
export function getFeatureDetailApi(id: string) {
  return requestClient.get(`/merchant/customer/feature/${id}`);
}

// 创建客户特性
export function createFeatureApi(data: any) {
  return requestClient.post(`/merchant/customer/feature`, data);
}

// 更新客户特性
export function updateFeatureApi(data: any) {
  return requestClient.put(`/merchant/customer/feature/${data.id}`, data);
}

// 删除客户特性
export function deleteFeatureApi(id: string) {
  return requestClient.delete(`/merchant/customer/feature/${id}`);
}

// 批量删除客户特性
export function batchDeleteFeatureApi(ids: string[]) {
  return requestClient.delete(`/merchant/customer/feature/batch`, { data: { ids } });
}

// ==================== 客户积分设置 APIs ====================

// 获取积分设置
export function getIntegralSettingsApi() {
  return requestClient.get(`/merchant/customer/integral/settings`);
}

// 更新积分设置
export function updateIntegralSettingsApi(data: any) {
  return requestClient.put(`/merchant/customer/integral/settings`, data);
}

// ==================== 客户标签管理 APIs ====================

// 获取客户标签列表
export function getLabelListApi(data: any) {
  return requestClient.post(`/merchant/customer/label/list`, data);
}

// 获取客户标签详情
export function getLabelDetailApi(id: string) {
  return requestClient.get(`/merchant/customer/label/${id}`);
}

// 创建客户标签
export function createLabelApi(data: any) {
  return requestClient.post(`/merchant/customer/label`, data);
}

// 更新客户标签
export function updateLabelApi(data: any) {
  return requestClient.put(`/merchant/customer/label/${data.id}`, data);
}

// 删除客户标签
export function deleteLabelApi(id: string) {
  return requestClient.delete(`/merchant/customer/label/${id}`);
}

// 批量删除客户标签
export function batchDeleteLabelApi(ids: string[]) {
  return requestClient.delete(`/merchant/customer/label/batch`, { data: { ids } });
}

// 用户积分分页查询
export function getPointsDetailListApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/point/exchange-gifts/page-list`, data);
}

// 积分兑换
export function exchangePointsApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/point/exchange-gifts`, data);
}

// 保持原有的对象导出方式（向后兼容）
export const customerApi = {
  getPageList: getCustomerPageListApi,
  getList: getCustomerListApi,
  getDetail: getCustomerDetailApi,
  create: createCustomerApi,
  update: updateCustomerApi,
  delete: deleteCustomerApi,
  batchDelete: batchDeleteCustomerApi,
  updateTag: updateCustomerTagApi,
  getBalanceDetail: getBalanceDetailApi,
  getRechargeDetailList: getRechargeDetailListApi,
  getPointsDetailList: getPointsDetailListApi,
  exchangePoints: exchangePointsApi,
  // 客户账户管理
  getAccountList: getAccountListApi,
  getAccountDetail: getAccountDetailApi,
  createAccount: createAccountApi,
  updateAccount: updateAccountApi,
  deleteAccount: deleteAccountApi,
  batchDeleteAccount: batchDeleteAccountApi,
  // 客户权益设置
  getEquitySettings: getEquitySettingsApi,
  updateEquitySettings: updateEquitySettingsApi,
  // 客户特性管理
  getFeatureList: getFeatureListApi,
  getFeatureDetail: getFeatureDetailApi,
  createFeature: createFeatureApi,
  updateFeature: updateFeatureApi,
  deleteFeature: deleteFeatureApi,
  batchDeleteFeature: batchDeleteFeatureApi,
  // 客户积分设置
  getIntegralSettings: getIntegralSettingsApi,
  updateIntegralSettings: updateIntegralSettingsApi,
  // 客户标签管理
  getLabelList: getLabelListApi,
  getLabelDetail: getLabelDetailApi,
  createLabel: createLabelApi,
  updateLabel: updateLabelApi,
  deleteLabel: deleteLabelApi,
  batchDeleteLabel: batchDeleteLabelApi,
};


