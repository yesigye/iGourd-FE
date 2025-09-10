import { requestClient } from '#/api/request';

// ==================== 销售管理 APIs ====================

// 获取销售分页列表
export function getSalePageListApi(data: any) {
  return requestClient.post(`/merchant/sale/page-list`, data);
}

// 获取销售列表
export function getSaleListApi(data: any) {
  return requestClient.post(`/merchant/sale/list`, data);
}

// 获取销售详情
export function getSaleDetailApi(id: string) {
  return requestClient.get(`/merchant/sale/${id}`);
}

// 创建销售
export function createSaleApi(data: any) {
  return requestClient.post(`/merchant/sale/sale`, data);
}

// 更新销售
export function updateSaleApi(id: string, data: any) {
  return requestClient.put(`/merchant/sale/${id}`, data);
}

// 删除销售
export function deleteSaleApi(id: string) {
  return requestClient.delete(`/merchant/sale/${id}`);
}

// 批量删除销售
export function batchDeleteSaleApi(ids: string[]) {
  return requestClient.delete(`/merchant/sale/batch`, { data: { ids } });
}

// 创建或更新销售
export function createOrUpdateSaleApi(data: any) {
  if (data.id) {
    return updateSaleApi(data.id, data);
  } else {
    return createSaleApi(data);
  }
}

// ==================== 销售订单 APIs ====================

// 获取销售订单分页列表
export function getSaleOrderListApi(data: any) {
  return requestClient.post(`/merchant/sale/order/page-list`, data);
}

// 获取销售订单详情
export function getSaleOrderDetailApi(id: string) {
  return requestClient.get(`/merchant/sale/order/${id}`);
}

// 创建销售订单
export function createSaleOrderApi(data: any) {
  return requestClient.post(`/merchant/sale/order`, data);
}

// 更新销售订单
export function updateSaleOrderApi(id: string, data: any) {
  return requestClient.put(`/merchant/sale/order/${id}`, data);
}

// 删除销售订单
export function deleteSaleOrderApi(id: string) {
  return requestClient.delete(`/merchant/sale/order/${id}`);
}

// 批量删除销售订单
export function batchDeleteSaleOrderApi(ids: string[]) {
  return requestClient.delete(`/merchant/sale/order/batch`, { data: { ids } });
}

// 创建或更新销售订单
export function createOrUpdateSaleOrderApi(data: any) {
  if (data.id) {
    return updateSaleOrderApi(data.id, data);
  } else {
    return createSaleOrderApi(data);
  }
}

// ==================== 退款订单 APIs ====================

// 获取退款订单分页列表
export function getRefundOrderListApi(data: any) {
  return requestClient.post(`/merchant/sale/refund/page-list`, data);
}

// 获取退款订单详情
export function getRefundOrderDetailApi(id: string) {
  return requestClient.get(`/merchant/sale/refund/${id}`);
}

// 创建退款订单
export function createRefundOrderApi(data: any) {
  return requestClient.post(`/merchant/sale/refund`, data);
}

// 更新退款订单
export function updateRefundOrderApi(id: string, data: any) {
  return requestClient.put(`/merchant/sale/refund/${id}`, data);
}

// 删除退款订单
export function deleteRefundOrderApi(id: string) {
  return requestClient.delete(`/merchant/sale/refund/${id}`);
}

// 批量删除退款订单
export function batchDeleteRefundOrderApi(ids: string[]) {
  return requestClient.delete(`/merchant/sale/refund/batch`, { data: { ids } });
}

// 创建或更新退款订单
export function createOrUpdateRefundOrderApi(data: any) {
  if (data.id) {
    return updateRefundOrderApi(data.id, data);
  } else {
    return createRefundOrderApi(data);
  }
}

// ==================== 销售退货 APIs ====================

// 获取销售退货分页列表
export function getSaleReturnedListApi(data: any) {
  return requestClient.post(`/merchant/sale/returned/page-list`, data);
}

// 获取销售退货详情
export function getSaleReturnedDetailApi(id: string) {
  return requestClient.get(`/merchant/sale/returned/${id}`);
}

// 创建销售退货
export function createSaleReturnedApi(data: any) {
  return requestClient.post(`/merchant/sale/returned`, data);
}

// 更新销售退货
export function updateSaleReturnedApi(id: string, data: any) {
  return requestClient.put(`/merchant/sale/returned/${id}`, data);
}

// 删除销售退货
export function deleteSaleReturnedApi(id: string) {
  return requestClient.delete(`/merchant/sale/returned/${id}`);
}

// 批量删除销售退货
export function batchDeleteSaleReturnedApi(ids: string[]) {
  return requestClient.delete(`/merchant/sale/returned/batch`, { data: { ids } });
}

// 创建或更新销售退货
export function createOrUpdateSaleReturnedApi(data: any) {
  if (data.id) {
    return updateSaleReturnedApi(data.id, data);
  } else {
    return createSaleReturnedApi(data);
  }
}

// ==================== 销售扫码 APIs ====================

// 获取销售扫码分页列表
export function getSaleScanListApi(data: any) {
  return requestClient.post(`/merchant/sale/scan/page-list`, data);
}

// 获取销售扫码详情
export function getSaleScanDetailApi(id: string) {
  return requestClient.get(`/merchant/sale/scan/${id}`);
}

// 创建销售扫码
export function createSaleScanApi(data: any) {
  return requestClient.post(`/merchant/sale/scan`, data);
}

// 更新销售扫码
export function updateSaleScanApi(id: string, data: any) {
  return requestClient.put(`/merchant/sale/scan/${id}`, data);
}

// 删除销售扫码
export function deleteSaleScanApi(id: string) {
  return requestClient.delete(`/merchant/sale/scan/${id}`);
}

// 批量删除销售扫码
export function batchDeleteSaleScanApi(ids: string[]) {
  return requestClient.delete(`/merchant/sale/scan/batch`, { data: { ids } });
}

// 创建或更新销售扫码
export function createOrUpdateSaleScanApi(data: any) {
  if (data.id) {
    return updateSaleScanApi(data.id, data);
  } else {
    return createSaleScanApi(data);
  }
}

// ==================== 销售班次 APIs ====================

// 获取销售班次分页列表
export function getSaleShiftsListApi(data: any) {
  return requestClient.post(`/merchant/sale/shifts/page-list`, data);
}

// 获取销售班次详情
export function getSaleShiftsDetailApi(id: string) {
  return requestClient.get(`/merchant/sale/shifts/${id}`);
}

// 创建销售班次
export function createSaleShiftsApi(data: any) {
  return requestClient.post(`/merchant/sale/shifts`, data);
}

// 更新销售班次
export function updateSaleShiftsApi(id: string, data: any) {
  return requestClient.put(`/merchant/sale/shifts/${id}`, data);
}

// 删除销售班次
export function deleteSaleShiftsApi(id: string) {
  return requestClient.delete(`/merchant/sale/shifts/${id}`);
}

// 批量删除销售班次
export function batchDeleteSaleShiftsApi(ids: string[]) {
  return requestClient.delete(`/merchant/sale/shifts/batch`, { data: { ids } });
}

// 创建或更新销售班次
export function createOrUpdateSaleShiftsApi(data: any) {
  if (data.id) {
    return updateSaleShiftsApi(data.id, data);
  } else {
    return createSaleShiftsApi(data);
  }
}

// ==================== 销售录入 APIs ====================

// 获取销售录入分页列表
export function getSaleEnterListApi(data: any) {
  return requestClient.post(`/merchant/sale/enter/page-list`, data);
}

// 获取销售录入详情
export function getSaleEnterDetailApi(id: string) {
  return requestClient.get(`/merchant/sale/enter/${id}`);
}

// 创建销售录入
export function createSaleEnterApi(data: any) {
  return requestClient.post(`/merchant/sale/enter`, data);
}

// 更新销售录入
export function updateSaleEnterApi(id: string, data: any) {
  return requestClient.put(`/merchant/sale/enter/${id}`, data);
}

// 删除销售录入
export function deleteSaleEnterApi(id: string) {
  return requestClient.delete(`/merchant/sale/enter/${id}`);
}

// 批量删除销售录入
export function batchDeleteSaleEnterApi(ids: string[]) {
  return requestClient.delete(`/merchant/sale/enter/batch`, { data: { ids } });
}

// 创建或更新销售录入
export function createOrUpdateSaleEnterApi(data: any) {
  if (data.id) {
    return updateSaleEnterApi(data.id, data);
  } else {
    return createSaleEnterApi(data);
  }
}

// ==================== 通用 APIs ====================

// 获取客户列表
export function getCustomerListApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/page-list`, data);
}

// 导出功能
export function exportSaleApi(data: any) {
  return requestClient.post(`/merchant/sale/export`, data);
}

export function exportSaleOrderApi(data: any) {
  return requestClient.post(`/merchant/sale/order/export`, data);
}

export function exportRefundOrderApi(data: any) {
  return requestClient.post(`/merchant/sale/refund/export`, data);
}

export function exportSaleReturnedApi(data: any) {
  return requestClient.post(`/merchant/sale/returned/export`, data);
}

export function exportSaleScanApi(data: any) {
  return requestClient.post(`/merchant/sale/scan/export`, data);
}

export function exportSaleShiftsApi(data: any) {
  return requestClient.post(`/merchant/sale/shifts/export`, data);
}

export function exportSaleEnterApi(data: any) {
  return requestClient.post(`/merchant/sale/enter/export`, data);
}

// 保持原有的对象导出方式（向后兼容）
export const saleApi = {
  // 销售管理
  getPageList: getSalePageListApi,
  getList: getSaleListApi,
  getDetail: getSaleDetailApi,
  create: createSaleApi,
  update: updateSaleApi,
  delete: deleteSaleApi,
  batchDelete: batchDeleteSaleApi,
  
  // 销售订单
  getOrderList: getSaleOrderListApi,
  getOrderDetail: getSaleOrderDetailApi,
  createOrder: createSaleOrderApi,
  updateOrder: updateSaleOrderApi,
  deleteOrder: deleteSaleOrderApi,
  batchDeleteOrder: batchDeleteSaleOrderApi,
  
  // 退款订单
  getRefundList: getRefundOrderListApi,
  getRefundDetail: getRefundOrderDetailApi,
  createRefund: createRefundOrderApi,
  updateRefund: updateRefundOrderApi,
  deleteRefund: deleteRefundOrderApi,
  batchDeleteRefund: batchDeleteRefundOrderApi,
  
  // 销售退货
  getReturnedList: getSaleReturnedListApi,
  getReturnedDetail: getSaleReturnedDetailApi,
  createReturned: createSaleReturnedApi,
  updateReturned: updateSaleReturnedApi,
  deleteReturned: deleteSaleReturnedApi,
  batchDeleteReturned: batchDeleteSaleReturnedApi,
  
  // 销售扫码
  getScanList: getSaleScanListApi,
  getScanDetail: getSaleScanDetailApi,
  createScan: createSaleScanApi,
  updateScan: updateSaleScanApi,
  deleteScan: deleteSaleScanApi,
  batchDeleteScan: batchDeleteSaleScanApi,
  
  // 销售班次
  getShiftsList: getSaleShiftsListApi,
  getShiftsDetail: getSaleShiftsDetailApi,
  createShifts: createSaleShiftsApi,
  updateShifts: updateSaleShiftsApi,
  deleteShifts: deleteSaleShiftsApi,
  batchDeleteShifts: batchDeleteSaleShiftsApi,
  
  // 销售录入
  getEnterList: getSaleEnterListApi,
  getEnterDetail: getSaleEnterDetailApi,
  createEnter: createSaleEnterApi,
  updateEnter: updateSaleEnterApi,
  deleteEnter: deleteSaleEnterApi,
  batchDeleteEnter: batchDeleteSaleEnterApi,
  
  // 通用
  getCustomerList: getCustomerListApi,
  export: exportSaleApi,
  exportOrder: exportSaleOrderApi,
  exportRefund: exportRefundOrderApi,
  exportReturned: exportSaleReturnedApi,
  exportScan: exportSaleScanApi,
  exportShifts: exportSaleShiftsApi,
  exportEnter: exportSaleEnterApi,
};

