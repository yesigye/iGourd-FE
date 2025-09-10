import { requestClient } from '#/api/request';

// ==================== 报表管理 APIs ====================

// 获取报表分页列表
export function getReportPageListApi(data: any) {
  return requestClient.post(`/merchant/reports/page-list`, data);
}

// 获取报表列表
export function getReportListApi(data: any) {
  return requestClient.post(`/merchant/reports/list`, data);
}

// 获取报表详情
export function getReportDetailApi(id: string) {
  return requestClient.get(`/merchant/reports/${id}`);
}

// 创建报表
export function createReportApi(data: any) {
  return requestClient.post(`/merchant/reports/report`, data);
}

// 更新报表
export function updateReportApi(id: string, data: any) {
  return requestClient.put(`/merchant/reports/${id}`, data);
}

// 删除报表
export function deleteReportApi(id: string) {
  return requestClient.delete(`/merchant/reports/${id}`);
}

// 批量删除报表
export function batchDeleteReportApi(ids: string[]) {
  return requestClient.delete(`/merchant/reports/batch`, { data: { ids } });
}

// 创建或更新报表
export function createOrUpdateReportApi(data: any) {
  if (data.id) {
    return updateReportApi(data.id, data);
  } else {
    return createReportApi(data);
  }
}

// ==================== 客户报表 APIs ====================

// 获取客户报表分页列表
export function getCustomerReportListApi(data: any) {
  return requestClient.post(`/merchant/reports/customer/page-list`, data);
}

// 获取客户报表详情
export function getCustomerReportDetailApi(id: string) {
  return requestClient.get(`/merchant/reports/customer/${id}`);
}

// 创建客户报表
export function createCustomerReportApi(data: any) {
  return requestClient.post(`/merchant/reports/customer`, data);
}

// 更新客户报表
export function updateCustomerReportApi(id: string, data: any) {
  return requestClient.put(`/merchant/reports/customer/${id}`, data);
}

// 删除客户报表
export function deleteCustomerReportApi(id: string) {
  return requestClient.delete(`/merchant/reports/customer/${id}`);
}

// 批量删除客户报表
export function batchDeleteCustomerReportApi(ids: string[]) {
  return requestClient.delete(`/merchant/reports/customer/batch`, { data: { ids } });
}

// 创建或更新客户报表
export function createOrUpdateCustomerReportApi(data: any) {
  if (data.id) {
    return updateCustomerReportApi(data.id, data);
  } else {
    return createCustomerReportApi(data);
  }
}

// ==================== 财务报表 APIs ====================

// 获取财务报表分页列表
export function getFinancialReportListApi(data: any) {
  return requestClient.post(`/merchant/reports/financial/page-list`, data);
}

// 获取财务报表详情
export function getFinancialReportDetailApi(id: string) {
  return requestClient.get(`/merchant/reports/financial/${id}`);
}

// 创建财务报表
export function createFinancialReportApi(data: any) {
  return requestClient.post(`/merchant/reports/financial`, data);
}

// 更新财务报表
export function updateFinancialReportApi(id: string, data: any) {
  return requestClient.put(`/merchant/reports/financial/${id}`, data);
}

// 删除财务报表
export function deleteFinancialReportApi(id: string) {
  return requestClient.delete(`/merchant/reports/financial/${id}`);
}

// 批量删除财务报表
export function batchDeleteFinancialReportApi(ids: string[]) {
  return requestClient.delete(`/merchant/reports/financial/batch`, { data: { ids } });
}

// 创建或更新财务报表
export function createOrUpdateFinancialReportApi(data: any) {
  if (data.id) {
    return updateFinancialReportApi(data.id, data);
  } else {
    return createFinancialReportApi(data);
  }
}

// ==================== 库存报表 APIs ====================

// 获取库存报表分页列表
export function getInventoryReportListApi(data: any) {
  return requestClient.post(`/merchant/reports/inventory/page-list`, data);
}

// 获取库存报表详情
export function getInventoryReportDetailApi(id: string) {
  return requestClient.get(`/merchant/reports/inventory/${id}`);
}

// 创建库存报表
export function createInventoryReportApi(data: any) {
  return requestClient.post(`/merchant/reports/inventory`, data);
}

// 更新库存报表
export function updateInventoryReportApi(id: string, data: any) {
  return requestClient.put(`/merchant/reports/inventory/${id}`, data);
}

// 删除库存报表
export function deleteInventoryReportApi(id: string) {
  return requestClient.delete(`/merchant/reports/inventory/${id}`);
}

// 批量删除库存报表
export function batchDeleteInventoryReportApi(ids: string[]) {
  return requestClient.delete(`/merchant/reports/inventory/batch`, { data: { ids } });
}

// 创建或更新库存报表
export function createOrUpdateInventoryReportApi(data: any) {
  if (data.id) {
    return updateInventoryReportApi(data.id, data);
  } else {
    return createInventoryReportApi(data);
  }
}

// ==================== 销售报表 APIs ====================

// 获取销售报表分页列表
export function getSalesReportListApi(data: any) {
  return requestClient.post(`/merchant/reports/sales/page-list`, data);
}

// 获取销售报表详情
export function getSalesReportDetailApi(id: string) {
  return requestClient.get(`/merchant/reports/sales/${id}`);
}

// 创建销售报表
export function createSalesReportApi(data: any) {
  return requestClient.post(`/merchant/reports/sales`, data);
}

// 更新销售报表
export function updateSalesReportApi(id: string, data: any) {
  return requestClient.put(`/merchant/reports/sales/${id}`, data);
}

// 删除销售报表
export function deleteSalesReportApi(id: string) {
  return requestClient.delete(`/merchant/reports/sales/${id}`);
}

// 批量删除销售报表
export function batchDeleteSalesReportApi(ids: string[]) {
  return requestClient.delete(`/merchant/reports/sales/batch`, { data: { ids } });
}

// 创建或更新销售报表
export function createOrUpdateSalesReportApi(data: any) {
  if (data.id) {
    return updateSalesReportApi(data.id, data);
  } else {
    return createSalesReportApi(data);
  }
}

// ==================== 通用 APIs ====================

// 获取客户列表
export function getCustomerListApi(data: any) {
  return requestClient.post(`/merchant/reports/customer/page-list`, data);
}

// 获取产品列表
export function getProductListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/product/page-list`, data);
}

// 导出功能
export function exportReportApi(data: any) {
  return requestClient.post(`/merchant/reports/export`, data);
}

export function exportCustomerReportApi(data: any) {
  return requestClient.post(`/merchant/reports/customer/export`, data);
}

export function exportFinancialReportApi(data: any) {
  return requestClient.post(`/merchant/reports/financial/export`, data);
}

export function exportInventoryReportApi(data: any) {
  return requestClient.post(`/merchant/reports/inventory/export`, data);
}

export function exportSalesReportApi(data: any) {
  return requestClient.post(`/merchant/reports/sales/export`, data);
}

// 保持原有的对象导出方式（向后兼容）
export const reportApi = {
  // 报表管理
  getPageList: getReportPageListApi,
  getList: getReportListApi,
  getDetail: getReportDetailApi,
  create: createReportApi,
  update: updateReportApi,
  delete: deleteReportApi,
  batchDelete: batchDeleteReportApi,
  
  // 客户报表
  getCustomerReportList: getCustomerReportListApi,
  getCustomerReportDetail: getCustomerReportDetailApi,
  createCustomerReport: createCustomerReportApi,
  updateCustomerReport: updateCustomerReportApi,
  deleteCustomerReport: deleteCustomerReportApi,
  batchDeleteCustomerReport: batchDeleteCustomerReportApi,
  
  // 财务报表
  getFinancialReportList: getFinancialReportListApi,
  getFinancialReportDetail: getFinancialReportDetailApi,
  createFinancialReport: createFinancialReportApi,
  updateFinancialReport: updateFinancialReportApi,
  deleteFinancialReport: deleteFinancialReportApi,
  batchDeleteFinancialReport: batchDeleteFinancialReportApi,
  
  // 库存报表
  getInventoryReportList: getInventoryReportListApi,
  getInventoryReportDetail: getInventoryReportDetailApi,
  createInventoryReport: createInventoryReportApi,
  updateInventoryReport: updateInventoryReportApi,
  deleteInventoryReport: deleteInventoryReportApi,
  batchDeleteInventoryReport: batchDeleteInventoryReportApi,
  
  // 销售报表
  getSalesReportList: getSalesReportListApi,
  getSalesReportDetail: getSalesReportDetailApi,
  createSalesReport: createSalesReportApi,
  updateSalesReport: updateSalesReportApi,
  deleteSalesReport: deleteSalesReportApi,
  batchDeleteSalesReport: batchDeleteSalesReportApi,
  
  // 通用
  getCustomerList: getCustomerListApi,
  getProductList: getProductListApi,
  export: exportReportApi,
  exportCustomer: exportCustomerReportApi,
  exportFinancial: exportFinancialReportApi,
  exportInventory: exportInventoryReportApi,
  exportSales: exportSalesReportApi,
};

