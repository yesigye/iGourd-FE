import { requestClient } from '#/api/request';

// ==================== 库存管理 APIs ====================

// 获取库存分页列表
export function getInventoryPageListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/page-list`, data);
}

// 获取库存列表
export function getInventoryListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/list`, data);
}

// 获取库存详情
export function getInventoryDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/${id}`);
}

// 创建库存
export function createInventoryApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/inventory`, data);
}

// 更新库存
export function updateInventoryApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/${id}`, data);
}

// 删除库存
export function deleteInventoryApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/${id}`);
}

// 批量删除库存
export function batchDeleteInventoryApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/batch`, { data: { ids } });
}

// 清空库存
export function clearInventoryApi(ids: string[]) {
  return requestClient.post(`/merchant/basics/inventory/clear`, { ids });
}

// 创建或更新库存
export function createOrUpdateInventoryApi(data: any) {
  if (data.id) {
    return updateInventoryApi(data.id, data);
  } else {
    return createInventoryApi(data);
  }
}

// ==================== 库存变更日志 APIs ====================

// 获取库存变更日志列表
export function getChangeLogListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/change-log/list`, data);
}

// 获取库存变更日志详情
export function getChangeLogDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/change-log/${id}`);
}

// ==================== 库存盘点 APIs ====================

// 获取库存盘点分页列表
export function getCountListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/count/page-list`, data);
}

// 获取库存盘点详情
export function getCountDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/count/${id}`);
}

// 创建库存盘点
export function createCountApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/count`, data);
}

// 更新库存盘点
export function updateCountApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/count/${id}`, data);
}

// 删除库存盘点
export function deleteCountApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/count/${id}`);
}

// 批量删除库存盘点
export function batchDeleteCountApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/count/batch`, { data: { ids } });
}

// ==================== 库存价格日志 APIs ====================

// 获取库存价格日志列表
export function getPriceLogListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/price-log/list`, data);
}

// 获取库存价格日志详情
export function getPriceLogDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/price-log/${id}`);
}

// ==================== 库存变动 APIs ====================

// 获取库存变动分页列表
export function getInventoryChangeListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/change/page-list`, data);
}

// 获取库存变动详情
export function getInventoryChangeDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/change/${id}`);
}

// 创建库存变动
export function createInventoryChangeApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/change`, data);
}

// 更新库存变动
export function updateInventoryChangeApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/change/${id}`, data);
}

// 删除库存变动
export function deleteInventoryChangeApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/change/${id}`);
}

// 批量删除库存变动
export function batchDeleteInventoryChangeApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/change/batch`, { data: { ids } });
}

// 创建或更新库存变动
export function createOrUpdateInventoryChangeApi(data: any) {
  if (data.id) {
    return updateInventoryChangeApi(data.id, data);
  } else {
    return createInventoryChangeApi(data);
  }
}

// ==================== 库存盘点 APIs ====================

// 获取库存盘点分页列表
export function getInventoryCountListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/count/page-list`, data);
}

// 获取库存盘点详情
export function getInventoryCountDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/count/${id}`);
}

// 创建库存盘点
export function createInventoryCountApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/count`, data);
}

// 更新库存盘点
export function updateInventoryCountApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/count/${id}`, data);
}

// 删除库存盘点
export function deleteInventoryCountApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/count/${id}`);
}

// 批量删除库存盘点
export function batchDeleteInventoryCountApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/count/batch`, { data: { ids } });
}

// 创建或更新库存盘点
export function createOrUpdateInventoryCountApi(data: any) {
  if (data.id) {
    return updateInventoryCountApi(data.id, data);
  } else {
    return createInventoryCountApi(data);
  }
}

// ==================== 库存价格 APIs ====================

// 获取库存价格分页列表
export function getInventoryPriceListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/price/page-list`, data);
}

// 获取库存价格详情
export function getInventoryPriceDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/price/${id}`);
}

// 创建库存价格
export function createInventoryPriceApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/price`, data);
}

// 更新库存价格
export function updateInventoryPriceApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/price/${id}`, data);
}

// 删除库存价格
export function deleteInventoryPriceApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/price/${id}`);
}

// 批量删除库存价格
export function batchDeleteInventoryPriceApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/price/batch`, { data: { ids } });
}

// 创建或更新库存价格
export function createOrUpdateInventoryPriceApi(data: any) {
  if (data.id) {
    return updateInventoryPriceApi(data.id, data);
  } else {
    return createInventoryPriceApi(data);
  }
}

// ==================== 商品规格 APIs ====================

// 获取商品规格分页列表
export function getProductSpecListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/product-spec/page-list`, data);
}

// 获取商品规格详情
export function getProductSpecDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/product-spec/${id}`);
}

// 创建商品规格
export function createProductSpecApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/product-spec`, data);
}

// 更新商品规格
export function updateProductSpecApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/product-spec/${id}`, data);
}

// 删除商品规格
export function deleteProductSpecApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/product-spec/${id}`);
}

// 批量删除商品规格
export function batchDeleteProductSpecApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/product-spec/batch`, { data: { ids } });
}

// 创建或更新商品规格
export function createOrUpdateProductSpecApi(data: any) {
  if (data.id) {
    return updateProductSpecApi(data.id, data);
  } else {
    return createProductSpecApi(data);
  }
}

// ==================== SKU列表 APIs ====================

// 获取SKU列表分页列表
export function getSkuListListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/sku-list/page-list`, data);
}

// 获取SKU列表详情
export function getSkuListDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/sku-list/${id}`);
}

// 创建SKU列表
export function createSkuListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/sku-list`, data);
}

// 更新SKU列表
export function updateSkuListApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/sku-list/${id}`, data);
}

// 删除SKU列表
export function deleteSkuListApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/sku-list/${id}`);
}

// 批量删除SKU列表
export function batchDeleteSkuListApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/sku-list/batch`, { data: { ids } });
}

// 创建或更新SKU列表
export function createOrUpdateSkuListApi(data: any) {
  if (data.id) {
    return updateSkuListApi(data.id, data);
  } else {
    return createSkuListApi(data);
  }
}

// ==================== 库存损耗 APIs ====================

// 获取库存损耗分页列表
export function getInventorySpoilageListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/spoilage/page-list`, data);
}

// 获取库存损耗详情
export function getInventorySpoilageDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/spoilage/${id}`);
}

// 创建库存损耗
export function createInventorySpoilageApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/spoilage`, data);
}

// 更新库存损耗
export function updateInventorySpoilageApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/spoilage/${id}`, data);
}

// 删除库存损耗
export function deleteInventorySpoilageApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/spoilage/${id}`);
}

// 批量删除库存损耗
export function batchDeleteInventorySpoilageApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/spoilage/batch`, { data: { ids } });
}

// 创建或更新库存损耗
export function createOrUpdateInventorySpoilageApi(data: any) {
  if (data.id) {
    return updateInventorySpoilageApi(data.id, data);
  } else {
    return createInventorySpoilageApi(data);
  }
}

// ==================== 库存调拨 APIs ====================

// 获取库存调拨分页列表
export function getInventoryTransferListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/transfer/page-list`, data);
}

// 获取库存调拨详情
export function getInventoryTransferDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/transfer/${id}`);
}

// 创建库存调拨
export function createInventoryTransferApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/transfer`, data);
}

// 更新库存调拨
export function updateInventoryTransferApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/transfer/${id}`, data);
}

// 删除库存调拨
export function deleteInventoryTransferApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/transfer/${id}`);
}

// 批量删除库存调拨
export function batchDeleteInventoryTransferApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/transfer/batch`, { data: { ids } });
}

// 创建或更新库存调拨
export function createOrUpdateInventoryTransferApi(data: any) {
  if (data.id) {
    return updateInventoryTransferApi(data.id, data);
  } else {
    return createInventoryTransferApi(data);
  }
}

// ==================== 库存单位 APIs ====================

// 获取库存单位分页列表
export function getInventoryUnitListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/unit/page-list`, data);
}

// 获取库存单位详情
export function getInventoryUnitDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/unit/${id}`);
}

// 创建库存单位
export function createInventoryUnitApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/unit`, data);
}

// 更新库存单位
export function updateInventoryUnitApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/unit/${id}`, data);
}

// 删除库存单位
export function deleteInventoryUnitApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/unit/${id}`);
}

// 批量删除库存单位
export function batchDeleteInventoryUnitApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/unit/batch`, { data: { ids } });
}

// 创建或更新库存单位
export function createOrUpdateInventoryUnitApi(data: any) {
  if (data.id) {
    return updateInventoryUnitApi(data.id, data);
  } else {
    return createInventoryUnitApi(data);
  }
}

// ==================== 仓库管理 APIs ====================

// 获取仓库分页列表
export function getWarehouseListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/warehouse/page-list`, data);
}

// 获取仓库详情
export function getWarehouseDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/warehouse/${id}`);
}

// 创建仓库
export function createWarehouseApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/warehouse`, data);
}

// 更新仓库
export function updateWarehouseApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/warehouse/${id}`, data);
}

// 删除仓库
export function deleteWarehouseApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/warehouse/${id}`);
}

// 批量删除仓库
export function batchDeleteWarehouseApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/warehouse/batch`, { data: { ids } });
}

// 创建或更新仓库
export function createOrUpdateWarehouseApi(data: any) {
  if (data.id) {
    return updateWarehouseApi(data.id, data);
  } else {
    return createWarehouseApi(data);
  }
}

// ==================== 商品管理 APIs ====================

// 获取商品分页列表
export function getProductListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/product/page-list`, data);
}

// 获取商品详情
export function getProductDetailApi(id: string) {
  return requestClient.get(`/merchant/basics/inventory/product/${id}`);
}

// 创建商品
export function createProductApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/product`, data);
}

// 更新商品
export function updateProductApi(id: string, data: any) {
  return requestClient.put(`/merchant/basics/inventory/product/${id}`, data);
}

// 删除商品
export function deleteProductApi(id: string) {
  return requestClient.delete(`/merchant/basics/inventory/product/${id}`);
}

// 批量删除商品
export function batchDeleteProductApi(ids: string[]) {
  return requestClient.delete(`/merchant/basics/inventory/product/batch`, { data: { ids } });
}

// 创建或更新商品
export function createOrUpdateProductApi(data: any) {
  if (data.id) {
    return updateProductApi(data.id, data);
  } else {
    return createProductApi(data);
  }
}

// ==================== 通用 APIs ====================

// 库存清零
export function clearInventoryApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/clear`, data);
}

// 库存移除
export function removeInventoryApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/remove`, data);
}

// 导出功能
export function exportInventoryApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/export`, data);
}

export function exportInventoryChangeApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/change/export`, data);
}

export function exportInventoryCountApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/count/export`, data);
}

export function exportInventoryPriceApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/price/export`, data);
}

export function exportProductSpecApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/product-spec/export`, data);
}

export function exportSkuListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/sku-list/export`, data);
}

export function exportInventorySpoilageApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/spoilage/export`, data);
}

export function exportInventoryTransferApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/transfer/export`, data);
}

export function exportInventoryUnitApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/unit/export`, data);
}

export function exportWarehouseApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/warehouse/export`, data);
}

export function exportProductApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/product/export`, data);
}

// 保持原有的对象导出方式（向后兼容）
export const inventoryApi = {
  // 库存管理
  getPageList: getInventoryPageListApi,
  getList: getInventoryListApi,
  getDetail: getInventoryDetailApi,
  create: createInventoryApi,
  update: updateInventoryApi,
  delete: deleteInventoryApi,
  batchDelete: batchDeleteInventoryApi,
  
  // 库存变动
  getChangeList: getInventoryChangeListApi,
  getChangeDetail: getInventoryChangeDetailApi,
  createChange: createInventoryChangeApi,
  updateChange: updateInventoryChangeApi,
  deleteChange: deleteInventoryChangeApi,
  batchDeleteChange: batchDeleteInventoryChangeApi,
  
  // 库存盘点
  getCountList: getInventoryCountListApi,
  getCountDetail: getInventoryCountDetailApi,
  createCount: createInventoryCountApi,
  updateCount: updateInventoryCountApi,
  deleteCount: deleteInventoryCountApi,
  batchDeleteCount: batchDeleteInventoryCountApi,
  
  // 库存价格
  getPriceList: getInventoryPriceListApi,
  getPriceDetail: getInventoryPriceDetailApi,
  createPrice: createInventoryPriceApi,
  updatePrice: updateInventoryPriceApi,
  deletePrice: deleteInventoryPriceApi,
  batchDeletePrice: batchDeleteInventoryPriceApi,
  
  // 商品规格
  getProductSpecList: getProductSpecListApi,
  getProductSpecDetail: getProductSpecDetailApi,
  createProductSpec: createProductSpecApi,
  updateProductSpec: updateProductSpecApi,
  deleteProductSpec: deleteProductSpecApi,
  batchDeleteProductSpec: batchDeleteProductSpecApi,
  
  // SKU列表
  getSkuListList: getSkuListListApi,
  getSkuListDetail: getSkuListDetailApi,
  createSkuList: createSkuListApi,
  updateSkuList: updateSkuListApi,
  deleteSkuList: deleteSkuListApi,
  batchDeleteSkuList: batchDeleteSkuListApi,
  
  // 库存损耗
  getSpoilageList: getInventorySpoilageListApi,
  getSpoilageDetail: getInventorySpoilageDetailApi,
  createSpoilage: createInventorySpoilageApi,
  updateSpoilage: updateInventorySpoilageApi,
  deleteSpoilage: deleteInventorySpoilageApi,
  batchDeleteSpoilage: batchDeleteInventorySpoilageApi,
  
  // 库存调拨
  getTransferList: getInventoryTransferListApi,
  getTransferDetail: getInventoryTransferDetailApi,
  createTransfer: createInventoryTransferApi,
  updateTransfer: updateInventoryTransferApi,
  deleteTransfer: deleteInventoryTransferApi,
  batchDeleteTransfer: batchDeleteInventoryTransferApi,
  
  // 库存单位
  getUnitList: getInventoryUnitListApi,
  getUnitDetail: getInventoryUnitDetailApi,
  createUnit: createInventoryUnitApi,
  updateUnit: updateInventoryUnitApi,
  deleteUnit: deleteInventoryUnitApi,
  batchDeleteUnit: batchDeleteInventoryUnitApi,
  
  // 仓库管理
  getWarehouseList: getWarehouseListApi,
  getWarehouseDetail: getWarehouseDetailApi,
  createWarehouse: createWarehouseApi,
  updateWarehouse: updateWarehouseApi,
  deleteWarehouse: deleteWarehouseApi,
  batchDeleteWarehouse: batchDeleteWarehouseApi,
  
  // 商品管理
  getProductList: getProductListApi,
  getProductDetail: getProductDetailApi,
  createProduct: createProductApi,
  updateProduct: updateProductApi,
  deleteProduct: deleteProductApi,
  batchDeleteProduct: batchDeleteProductApi,
  
  // 库存变更日志
  getChangeLogList: getChangeLogListApi,
  getChangeLogDetail: getChangeLogDetailApi,
  // 库存价格日志
  getPriceLogList: getPriceLogListApi,
  getPriceLogDetail: getPriceLogDetailApi,
  // 库存盘点
  getCountList: getCountListApi,
  getCountDetail: getCountDetailApi,
  createCount: createCountApi,
  updateCount: updateCountApi,
  deleteCount: deleteCountApi,
  batchDeleteCount: batchDeleteCountApi,
  
  // 通用
  clear: clearInventoryApi,
  remove: removeInventoryApi,
  export: exportInventoryApi,
  exportChange: exportInventoryChangeApi,
  exportCount: exportInventoryCountApi,
  exportPrice: exportInventoryPriceApi,
  exportProductSpec: exportProductSpecApi,
  exportSkuList: exportSkuListApi,
  exportSpoilage: exportInventorySpoilageApi,
  exportTransfer: exportInventoryTransferApi,
  exportUnit: exportInventoryUnitApi,
  exportWarehouse: exportWarehouseApi,
  exportProduct: exportProductApi,
};


