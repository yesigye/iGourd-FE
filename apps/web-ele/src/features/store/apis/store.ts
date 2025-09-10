import { requestClient } from '#/api/request';

// ==================== 店铺管理 APIs ====================

// 获取店铺分页列表
export function getStorePageListApi(data: any) {
  return requestClient.post(`/merchant/stores/page-list`, data);
}

// 获取店铺列表
export function getStoreListApi(data: any) {
  return requestClient.post(`/merchant/stores/list`, data);
}

// 获取店铺详情
export function getStoreDetailApi(id: string) {
  return requestClient.get(`/merchant/stores/${id}`);
}

// 创建店铺
export function createStoreApi(data: any) {
  return requestClient.post(`/merchant/stores/store`, data);
}

// 更新店铺
export function updateStoreApi(id: string, data: any) {
  return requestClient.put(`/merchant/stores/${id}`, data);
}

// 删除店铺
export function deleteStoreApi(id: string) {
  return requestClient.delete(`/merchant/stores/${id}`);
}

// 批量删除店铺
export function batchDeleteStoreApi(ids: string[]) {
  return requestClient.delete(`/merchant/stores/batch`, { data: { ids } });
}

// 创建或更新店铺
export function createOrUpdateStoreApi(data: any) {
  if (data.id) {
    return updateStoreApi(data.id, data);
  } else {
    return createStoreApi(data);
  }
}

// ==================== 店铺管理 APIs ====================

// 获取店铺管理分页列表
export function getStoreManagementListApi(data: any) {
  return requestClient.post(`/merchant/stores/management/page-list`, data);
}

// 获取店铺管理详情
export function getStoreManagementDetailApi(id: string) {
  return requestClient.get(`/merchant/stores/management/${id}`);
}

// 创建店铺管理
export function createStoreManagementApi(data: any) {
  return requestClient.post(`/merchant/stores/management`, data);
}

// 更新店铺管理
export function updateStoreManagementApi(id: string, data: any) {
  return requestClient.put(`/merchant/stores/management/${id}`, data);
}

// 删除店铺管理
export function deleteStoreManagementApi(id: string) {
  return requestClient.delete(`/merchant/stores/management/${id}`);
}

// 批量删除店铺管理
export function batchDeleteStoreManagementApi(ids: string[]) {
  return requestClient.delete(`/merchant/stores/management/batch`, { data: { ids } });
}

// 创建或更新店铺管理
export function createOrUpdateStoreManagementApi(data: any) {
  if (data.id) {
    return updateStoreManagementApi(data.id, data);
  } else {
    return createStoreManagementApi(data);
  }
}

// ==================== 店铺设置 APIs ====================

// 获取店铺设置分页列表
export function getStoreSettingsListApi(data: any) {
  return requestClient.post(`/merchant/stores/settings/page-list`, data);
}

// 获取店铺设置详情
export function getStoreSettingsDetailApi(id: string) {
  return requestClient.get(`/merchant/stores/settings/${id}`);
}

// 创建店铺设置
export function createStoreSettingsApi(data: any) {
  return requestClient.post(`/merchant/stores/settings`, data);
}

// 更新店铺设置
export function updateStoreSettingsApi(id: string, data: any) {
  return requestClient.put(`/merchant/stores/settings/${id}`, data);
}

// 删除店铺设置
export function deleteStoreSettingsApi(id: string) {
  return requestClient.delete(`/merchant/stores/settings/${id}`);
}

// 批量删除店铺设置
export function batchDeleteStoreSettingsApi(ids: string[]) {
  return requestClient.delete(`/merchant/stores/settings/batch`, { data: { ids } });
}

// 创建或更新店铺设置
export function createOrUpdateStoreSettingsApi(data: any) {
  if (data.id) {
    return updateStoreSettingsApi(data.id, data);
  } else {
    return createStoreSettingsApi(data);
  }
}

// ==================== 店铺员工 APIs ====================

// 获取店铺员工分页列表
export function getStoreStaffListApi(data: any) {
  return requestClient.post(`/merchant/stores/staff/page-list`, data);
}

// 获取店铺员工详情
export function getStoreStaffDetailApi(id: string) {
  return requestClient.get(`/merchant/stores/staff/${id}`);
}

// 创建店铺员工
export function createStoreStaffApi(data: any) {
  return requestClient.post(`/merchant/stores/staff`, data);
}

// 更新店铺员工
export function updateStoreStaffApi(id: string, data: any) {
  return requestClient.put(`/merchant/stores/staff/${id}`, data);
}

// 删除店铺员工
export function deleteStoreStaffApi(id: string) {
  return requestClient.delete(`/merchant/stores/staff/${id}`);
}

// 批量删除店铺员工
export function batchDeleteStoreStaffApi(ids: string[]) {
  return requestClient.delete(`/merchant/stores/staff/batch`, { data: { ids } });
}

// 创建或更新店铺员工
export function createOrUpdateStoreStaffApi(data: any) {
  if (data.id) {
    return updateStoreStaffApi(data.id, data);
  } else {
    return createStoreStaffApi(data);
  }
}

// ==================== 设备管理 APIs ====================

// 获取设备分页列表
export function getDeviceListApi(data: any) {
  return requestClient.post(`/merchant/stores/device/page-list`, data);
}

// 获取设备详情
export function getDeviceDetailApi(id: string) {
  return requestClient.get(`/merchant/stores/device/${id}`);
}

// 创建设备
export function createDeviceApi(data: any) {
  return requestClient.post(`/merchant/stores/device`, data);
}

// 更新设备
export function updateDeviceApi(id: string, data: any) {
  return requestClient.put(`/merchant/stores/device/${id}`, data);
}

// 删除设备
export function deleteDeviceApi(id: string) {
  return requestClient.delete(`/merchant/stores/device/${id}`);
}

// 批量删除设备
export function batchDeleteDeviceApi(ids: string[]) {
  return requestClient.delete(`/merchant/stores/device/batch`, { data: { ids } });
}

// 创建或更新设备
export function createOrUpdateDeviceApi(data: any) {
  if (data.id) {
    return updateDeviceApi(data.id, data);
  } else {
    return createDeviceApi(data);
  }
}

// ==================== 支付方式 APIs ====================

// 获取支付方式分页列表
export function getPaymentMethodListApi(data: any) {
  return requestClient.post(`/merchant/stores/payment-method/page-list`, data);
}

// 获取支付方式详情
export function getPaymentMethodDetailApi(id: string) {
  return requestClient.get(`/merchant/stores/payment-method/${id}`);
}

// 创建支付方式
export function createPaymentMethodApi(data: any) {
  return requestClient.post(`/merchant/stores/payment-method`, data);
}

// 更新支付方式
export function updatePaymentMethodApi(id: string, data: any) {
  return requestClient.put(`/merchant/stores/payment-method/${id}`, data);
}

// 删除支付方式
export function deletePaymentMethodApi(id: string) {
  return requestClient.delete(`/merchant/stores/payment-method/${id}`);
}

// 批量删除支付方式
export function batchDeletePaymentMethodApi(ids: string[]) {
  return requestClient.delete(`/merchant/stores/payment-method/batch`, { data: { ids } });
}

// 创建或更新支付方式
export function createOrUpdatePaymentMethodApi(data: any) {
  if (data.id) {
    return updatePaymentMethodApi(data.id, data);
  } else {
    return createPaymentMethodApi(data);
  }
}

// ==================== 通用 APIs ====================

// 获取员工列表
export function getEmployeeListApi(data: any) {
  return requestClient.post(`/merchant/employee/user/page-list`, data);
}

// 导出功能
export function exportStoreApi(data: any) {
  return requestClient.post(`/merchant/stores/export`, data);
}

export function exportStoreManagementApi(data: any) {
  return requestClient.post(`/merchant/stores/management/export`, data);
}

export function exportStoreSettingsApi(data: any) {
  return requestClient.post(`/merchant/stores/settings/export`, data);
}

export function exportStoreStaffApi(data: any) {
  return requestClient.post(`/merchant/stores/staff/export`, data);
}

export function exportDeviceApi(data: any) {
  return requestClient.post(`/merchant/stores/device/export`, data);
}

export function exportPaymentMethodApi(data: any) {
  return requestClient.post(`/merchant/stores/payment-method/export`, data);
}

// 保持原有的对象导出方式（向后兼容）
export const storeApi = {
  // 店铺管理
  getPageList: getStorePageListApi,
  getList: getStoreListApi,
  getDetail: getStoreDetailApi,
  create: createStoreApi,
  update: updateStoreApi,
  delete: deleteStoreApi,
  batchDelete: batchDeleteStoreApi,
  
  // 店铺管理
  getManagementList: getStoreManagementListApi,
  getManagementDetail: getStoreManagementDetailApi,
  createManagement: createStoreManagementApi,
  updateManagement: updateStoreManagementApi,
  deleteManagement: deleteStoreManagementApi,
  batchDeleteManagement: batchDeleteStoreManagementApi,
  
  // 店铺设置
  getSettingsList: getStoreSettingsListApi,
  getSettingsDetail: getStoreSettingsDetailApi,
  createSettings: createStoreSettingsApi,
  updateSettings: updateStoreSettingsApi,
  deleteSettings: deleteStoreSettingsApi,
  batchDeleteSettings: batchDeleteStoreSettingsApi,
  
  // 店铺员工
  getStaffList: getStoreStaffListApi,
  getStaffDetail: getStoreStaffDetailApi,
  createStaff: createStoreStaffApi,
  updateStaff: updateStoreStaffApi,
  deleteStaff: deleteStoreStaffApi,
  batchDeleteStaff: batchDeleteStoreStaffApi,
  
  // 设备管理
  getDeviceList: getDeviceListApi,
  getDeviceDetail: getDeviceDetailApi,
  createDevice: createDeviceApi,
  updateDevice: updateDeviceApi,
  deleteDevice: deleteDeviceApi,
  batchDeleteDevice: batchDeleteDeviceApi,
  
  // 支付方式
  getPaymentMethodList: getPaymentMethodListApi,
  getPaymentMethodDetail: getPaymentMethodDetailApi,
  createPaymentMethod: createPaymentMethodApi,
  updatePaymentMethod: updatePaymentMethodApi,
  deletePaymentMethod: deletePaymentMethodApi,
  batchDeletePaymentMethod: batchDeletePaymentMethodApi,
  
  // 通用
  getEmployeeList: getEmployeeListApi,
  export: exportStoreApi,
  exportManagement: exportStoreManagementApi,
  exportSettings: exportStoreSettingsApi,
  exportStaff: exportStoreStaffApi,
  exportDevice: exportDeviceApi,
  exportPaymentMethod: exportPaymentMethodApi,
};

