import { requestClient } from '#/api/request';
import { useUserStore } from '@igourd/stores';
import type { ProductInfoQueryParams, ProductProfileQueryParams } from './types';

// ==================== 采购管理 APIs ====================

// 获取采购分页列表
export function getPurchasePageListApi(data: any) {
  return requestClient.post(`/v1/merchant/purchase/vendor/page-list`, data);
}

// 获取采购列表
export function getPurchaseListApi(data: any) {
  return requestClient.post(`/v1/merchant/purchase/purchase-order/list`, data);
}

// 获取采购详情
export function getPurchaseDetailApi(data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/detail`,
    data,
  );
}

// 创建采购
export function createPurchaseApi(data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/create`,
    data,
  );
}

// 更新采购
export function updatePurchaseApi(id: string, data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/modify`,
    data,
  );
}

// 删除采购
export function deletePurchaseApi(id: string) {
  return requestClient.post(`/v1/merchant/purchase/purchase-order/remove`, {
    id,
  });
}

// 批量删除采购
export function batchDeletePurchaseApi(ids: string[]) {
  return requestClient.post(`/v1/merchant/purchase/purchase-order/remove`, {
    ids,
  });
}

export function createOrUpdateCustomer(data: any) {
  if (data.id) {
    return updatePurchaseApi(data.id, data);
  } else {
    return createPurchaseApi(data);
  }
}

// 创建或更新采购
export function createOrUpdatePurchaseApi(data: any) {
  if (data.id) {
    return updatePurchaseApi(data.id, data);
  } else {
    return createPurchaseApi(data);
  }
}

// ==================== 采购订单 APIs ====================

// 获取采购订单分页列表
export function getPurchaseOrderListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/page-list`,
    data,
  );
}

// 获取采购订单详情
export function getPurchaseOrderDetailApi(id: string) {
  return requestClient.post(`/v1/merchant/purchase/purchase-order/detail`, {
    id,
  });
}

// 创建采购订单
export function createPurchaseOrderApi(data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/create`,
    data,
  );
}

// 更新采购订单
export function updatePurchaseOrderApi(id: string, data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/modify`,
    data,
  );
}

// 删除采购订单
export function deletePurchaseOrderApi(id: string) {
  return requestClient.post(`/v1/merchant/purchase/purchase-order/remove`, {
    id,
  });
}

// 批量删除采购订单
export function batchDeletePurchaseOrderApi(ids: string[]) {
  return requestClient.post(`/v1/merchant/purchase/purchase-order/remove`, {
    ids,
  });
}

// 创建或更新采购订单
export function createOrUpdatePurchaseOrderApi(data: any) {
  if (data.id) {
    return updatePurchaseOrderApi(data.id, data);
  } else {
    return createPurchaseOrderApi(data);
  }
}

// ==================== 采购收据 APIs ====================

// 获取采购收据分页列表
export function getPurchaseReceiptListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/goods-receipt-note/page-list`,
    data,
  );
}

export function goodsReceiptDelete(data: unknown) {
  return requestClient.post(
    '/v1/merchant/purchase/goods-receipt-note/remove',
    data,
  );
}

// 获取采购收据详情
export function getPurchaseReceiptDetailApi(id: string) {
  return requestClient.get(`/v1/merchant/purchase/purchase-receipt/${id}`);
}

// 创建采购收据
export function createPurchaseReceiptApi(data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-order/receipt`,
    data,
  );
}

// 更新采购收据
export function updatePurchaseReceiptApi(id: string, data: any) {
  return requestClient.put(
    `/v1/merchant/purchase/purchase-receipt/${id}`,
    data,
  );
}

// 删除采购收据
export function deletePurchaseReceiptApi(id: string) {
  return requestClient.delete(`/v1/merchant/purchase/purchase-receipt/${id}`);
}

// 批量删除采购收据
export function batchDeletePurchaseReceiptApi(ids: string[]) {
  return requestClient.delete(`/v1/merchant/purchase/purchase-receipt/batch`, {
    data: { ids },
  });
}

// 创建或更新采购收据
export function createOrUpdatePurchaseReceiptApi(data: any) {
  if (data.id) {
    return updatePurchaseReceiptApi(data.id, data);
  } else {
    return createPurchaseReceiptApi(data);
  }
}

// ==================== 采购退货 APIs ====================

// 获取采购退货分页列表
export function getPurchaseReturnedListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-returned/list`,
    data,
  );
}

// 获取采购退货详情
export function getPurchaseReturnedDetailApi(id: string) {
  return requestClient.get(`/merchant/purchase/purchase-returned/${id}`);
}

// 创建采购退货
export function createPurchaseReturnedApi(data: any) {
  return requestClient.post(`/merchant/purchase/purchase-order/returned`, data);
}

// 更新采购退货
export function updatePurchaseReturnedApi(id: string, data: any) {
  return requestClient.put(`/merchant/purchase/purchase-returned/${id}`, data);
}

// 删除采购退货
export function deletePurchaseReturnedApi(id: string) {
  return requestClient.delete(`/merchant/purchase/purchase-returned/${id}`);
}

// 批量删除采购退货
export function batchDeletePurchaseReturnedApi(ids: string[]) {
  return requestClient.delete(`/merchant/purchase/purchase-returned/batch`, {
    data: { ids },
  });
}

// 创建或更新采购退货
export function createOrUpdatePurchaseReturnedApi(data: any) {
  if (data.id) {
    return updatePurchaseReturnedApi(data.id, data);
  } else {
    return createPurchaseReturnedApi(data);
  }
}

// ==================== 采购账单 APIs ====================

// 获取采购账单分页列表
export function getPurchaseBillsListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/purchase/purchase-bill/page-list`,
    data,
  );
}

// 获取采购账单详情
export function getPurchaseBillsDetailApi(id: string) {
  return requestClient.get(`/merchant/purchase/purchase-bill/${id}`);
}

// 创建采购账单
export function createPurchaseBillsApi(data: any) {
  return requestClient.post(`/merchant/purchase/purchase-order/bills`, data);
}

// 更新采购账单
export function updatePurchaseBillsApi(id: string, data: any) {
  return requestClient.put(`/merchant/purchase/purchase-bill/${id}`, data);
}

// 删除采购账单
export function deletePurchaseBillsApi(id: string) {
  return requestClient.delete(`/merchant/purchase/purchase-bill/${id}`);
}

// 批量删除采购账单
export function batchDeletePurchaseBillsApi(ids: string[]) {
  return requestClient.delete(`/merchant/purchase/purchase-bill/batch`, {
    data: { ids },
  });
}

// 创建或更新采购账单
export function createOrUpdatePurchaseBillsApi(data: any) {
  if (data.id) {
    return updatePurchaseBillsApi(data.id, data);
  } else {
    return createPurchaseBillsApi(data);
  }
}

// ==================== 定制采购 APIs ====================

// 获取定制采购详情
export function getPurchaseCustomizedDetailApi(id: string) {
  return requestClient.get(`/merchant/purchase/purchase-customized/${id}`);
}

// ==================== 新订单 APIs ====================

// 获取新订单分页列表
export function getPurchaseNewOrderListApi(data: any) {
  return requestClient.post(
    `/merchant/purchase/purchase-new-order/page-list`,
    data,
  );
}

// 获取新订单详情
export function getPurchaseNewOrderDetailApi(id: string) {
  return requestClient.get(`/merchant/purchase/purchase-new-order/${id}`);
}

// 创建新订单
export function createPurchaseNewOrderApi(data: any) {
  return requestClient.post(
    `/merchant/purchase/purchase-order/new-order`,
    data,
  );
}

// 更新新订单
export function updatePurchaseNewOrderApi(id: string, data: any) {
  return requestClient.put(`/merchant/purchase/purchase-new-order/${id}`, data);
}

// 删除新订单
export function deletePurchaseNewOrderApi(id: string) {
  return requestClient.delete(`/merchant/purchase/purchase-new-order/${id}`);
}

// 批量删除新订单
export function batchDeletePurchaseNewOrderApi(ids: string[]) {
  return requestClient.delete(`/merchant/purchase/purchase-new-order/batch`, {
    data: { ids },
  });
}

// 创建或更新新订单
export function createOrUpdatePurchaseNewOrderApi(data: any) {
  if (data.id) {
    return updatePurchaseNewOrderApi(data.id, data);
  } else {
    return createPurchaseNewOrderApi(data);
  }
}

// ==================== 新订单历史 APIs ====================

// 获取新订单历史分页列表
export function getPurchaseNewOrderHistoryListApi(data: any) {
  return requestClient.post(
    `/merchant/purchase/purchase-new-order-history/page-list`,
    data,
  );
}

// 获取新订单历史详情
export function getPurchaseNewOrderHistoryDetailApi(id: string) {
  return requestClient.get(
    `/merchant/purchase/purchase-new-order-history/${id}`,
  );
}

// 创建新订单历史
export function createPurchaseNewOrderHistoryApi(data: any) {
  return requestClient.post(
    `/merchant/purchase/purchase-order/new-order-history`,
    data,
  );
}

// 更新新订单历史
export function updatePurchaseNewOrderHistoryApi(id: string, data: any) {
  return requestClient.put(
    `/merchant/purchase/purchase-new-order-history/${id}`,
    data,
  );
}

// 删除新订单历史
export function deletePurchaseNewOrderHistoryApi(id: string) {
  return requestClient.delete(
    `/merchant/purchase/purchase-new-order-history/${id}`,
  );
}

// 批量删除新订单历史
export function batchDeletePurchaseNewOrderHistoryApi(ids: string[]) {
  return requestClient.delete(
    `/merchant/purchase/purchase-new-order-history/batch`,
    { data: { ids } },
  );
}

// 创建或更新新订单历史
export function createOrUpdatePurchaseNewOrderHistoryApi(data: any) {
  if (data.id) {
    return updatePurchaseNewOrderHistoryApi(data.id, data);
  } else {
    return createPurchaseNewOrderHistoryApi(data);
  }
}

// ==================== 供应商 APIs ====================

// 获取供应商分页列表
export function getVendorListApi(data: any) {
  return requestClient.post(`/merchant/purchase/vendor/page-list`, data);
}

// 获取供应商详情
export function getVendorDetailApi(id: string) {
  return requestClient.get(`/merchant/purchase/vendor/${id}`);
}

// 创建供应商
export function createVendorApi(data: any) {
  return requestClient.post(`/merchant/purchase/vendor`, data);
}

// 更新供应商
export function updateVendorApi(id: string, data: any) {
  return requestClient.put(`/merchant/purchase/vendor/${id}`, data);
}

// 删除供应商
export function deleteVendorApi(id: string) {
  return requestClient.delete(`/merchant/purchase/vendor/${id}`);
}

// 批量删除供应商
export function batchDeleteVendorApi(data: unknown) {
  return requestClient.post(`/merchant/purchase/vendor/batch`, data);
}

// 创建或更新供应商
export function createOrUpdateVendorApi(data: any) {
  if (data.id) {
    return updateVendorApi(data.id, data);
  } else {
    return createVendorApi(data);
  }
}

// ==================== 通用 APIs ====================

// 导出功能
export function exportPurchaseApi(data: any) {
  return requestClient.post(`/merchant/purchase/purchase-order/export`, data);
}

export function exportPurchaseOrderApi(data: any) {
  return requestClient.post(`/merchant/purchase/purchase-order/export`, data);
}

export function exportPurchaseReceiptApi(data: any) {
  return requestClient.post(`/merchant/purchase/purchase-receipt/export`, data);
}

export function exportPurchaseReturnedApi(data: any) {
  return requestClient.post(
    `/merchant/purchase/purchase-returned/export`,
    data,
  );
}

export function exportPurchaseBillsApi(data: any) {
  return requestClient.post(`/merchant/purchase/purchase-bill/export`, data);
}

export function exportPurchaseCustomizedApi(data: any) {
  return requestClient.post(
    `/merchant/purchase/purchase-customized/export`,
    data,
  );
}

export function exportPurchaseNewOrderApi(data: any) {
  return requestClient.post(
    `/merchant/purchase/purchase-new-order/export`,
    data,
  );
}

export function exportPurchaseNewOrderHistoryApi(data: any) {
  return requestClient.post(
    `/merchant/purchase/purchase-new-order-history/export`,
    data,
  );
}

export function exportVendorApi(data: any) {
  return requestClient.post(`/merchant/purchase/vendor/export`, data);
}

export function warehouseProductPageList(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/inventory/warehouse/product/page-list',
    data,
  );
}

export function productSearch(data: any) {
  const { currentLoginUserApp } = useUserStore();
  data.merchant_id = currentLoginUserApp.owner_id;
  return requestClient.post('/v1/merchant/basics/inventory/search', data);
}

// 保持原有的对象导出方式（向后兼容）
export const purchaseApi = {
  // 采购管理
  getPageList: getPurchasePageListApi,
  getList: getPurchaseListApi,
  getDetail: getPurchaseDetailApi,
  create: createPurchaseApi,
  update: updatePurchaseApi,
  delete: deletePurchaseApi,
  batchDelete: batchDeletePurchaseApi,

  // 采购订单
  getOrderList: getPurchaseOrderListApi,
  getOrderDetail: getPurchaseOrderDetailApi,
  createOrder: createPurchaseOrderApi,
  updateOrder: updatePurchaseOrderApi,
  deleteOrder: deletePurchaseOrderApi,
  batchDeleteOrder: batchDeletePurchaseOrderApi,

  // 采购收据
  getReceiptList: getPurchaseReceiptListApi,
  getReceiptDetail: getPurchaseReceiptDetailApi,
  createReceipt: createPurchaseReceiptApi,
  updateReceipt: updatePurchaseReceiptApi,
  deleteReceipt: deletePurchaseReceiptApi,
  batchDeleteReceipt: batchDeletePurchaseReceiptApi,

  // 采购退货
  getReturnedList: getPurchaseReturnedListApi,
  getReturnedDetail: getPurchaseReturnedDetailApi,
  createReturned: createPurchaseReturnedApi,
  updateReturned: updatePurchaseReturnedApi,
  deleteReturned: deletePurchaseReturnedApi,
  batchDeleteReturned: batchDeletePurchaseReturnedApi,

  // 采购账单
  getBillsList: getPurchaseBillsListApi,
  getBillsDetail: getPurchaseBillsDetailApi,
  createBills: createPurchaseBillsApi,
  updateBills: updatePurchaseBillsApi,
  deleteBills: deletePurchaseBillsApi,
  batchDeleteBills: batchDeletePurchaseBillsApi,

  getCustomizedDetail: getPurchaseCustomizedDetailApi,

  // 新订单
  getNewOrderList: getPurchaseNewOrderListApi,
  getNewOrderDetail: getPurchaseNewOrderDetailApi,
  createNewOrder: createPurchaseNewOrderApi,
  updateNewOrder: updatePurchaseNewOrderApi,
  deleteNewOrder: deletePurchaseNewOrderApi,
  batchDeleteNewOrder: batchDeletePurchaseNewOrderApi,

  // 新订单历史
  getNewOrderHistoryList: getPurchaseNewOrderHistoryListApi,
  getNewOrderHistoryDetail: getPurchaseNewOrderHistoryDetailApi,
  createNewOrderHistory: createPurchaseNewOrderHistoryApi,
  updateNewOrderHistory: updatePurchaseNewOrderHistoryApi,
  deleteNewOrderHistory: deletePurchaseNewOrderHistoryApi,
  batchDeleteNewOrderHistory: batchDeletePurchaseNewOrderHistoryApi,

  // 供应商
  getVendorList: getVendorListApi,
  getVendorDetail: getVendorDetailApi,
  createVendor: createVendorApi,
  updateVendor: updateVendorApi,
  deleteVendor: deleteVendorApi,
  batchDeleteVendor: batchDeleteVendorApi,

  // 导出
  export: exportPurchaseApi,
  exportOrder: exportPurchaseOrderApi,
  exportReceipt: exportPurchaseReceiptApi,
  exportReturned: exportPurchaseReturnedApi,
  exportBills: exportPurchaseBillsApi,
  exportCustomized: exportPurchaseCustomizedApi,
  exportNewOrder: exportPurchaseNewOrderApi,
  exportNewOrderHistory: exportPurchaseNewOrderHistoryApi,
  exportVendor: exportVendorApi,
};

export class InventoryService {
  // 商品导入
  //字段初始化要展示的列
  public static async dynamicTableColumnFind(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/dynamic-table-column/find',
      data,
    );
  }
  // 调整顺序和减少字段，调用 API同步后端保存
  public static async dynamicTableColumnModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/dynamic-table-column/modify',
      data,
    );
  }
  // 临时文件上传
  public static async tempUpload(data: any) {
    return requestClient.post('/resource/file-upload/temp/upload', data);
  }
  // 临时文件解析
  public static async excelParsing(data: any) {
    return requestClient.post('/resource/file-upload/excel/parsing', data);
  }
  // 文件预览
  public static async excelPreview(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/import/excel/preview',
      data,
      {
        timeout: 300000,
      },
    );
  }
  // 文件导入
  public static async excelImport(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/import/excel',
      data,
      {
        timeout: 300000,
      },
    );
  }
  // 商品分类
  // 商品一级分类信息查询
  public static async productFirstGroupList(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-group/first/page-list',
      data,
    );
  }
  // 商品二级分类信息查询
  public static async productTwoGroupList(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-group/second/page-list',
      data,
    );
  }
  //商品分类信息查询
  public static async productGroupList(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-group/page-list',
      data,
    );
  }
  //商品分类信息创建
  public static async productGroupCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-group/create',
      data,
    );
  }
  //商品分类信息修改
  public static async productGroupModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-group/modify',
      data,
    );
  }
  //商品分类信息批量删除
  public static async productGroupRemove(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-group/remove',
      data,
    );
  }
  // 标签
  // 商品标签信息查询（分页）
  public static async productLabelPage(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-label/page-list',
      data,
    );
  }
  // 商品标签信息创建
  public static async productLabelCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-label/create',
      data,
    );
  }
  // 商品标签信息修改
  public static async productLabelModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-label/modify',
      data,
    );
  }
  // 商品标签信息批量删除
  public static async productLabelRemove(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-label/remove',
      data,
    );
  }
  // 商品列表
  // 商品资料分页查询查询
  public static async productPageList(data: any, customerHeader = {}) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/page-list',
      data,
      customerHeader,
    );
  }
  // 商品创建
  public static async productCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/create',
      data,
    );
  }
  //商品信息详情
  public static async productDetail(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/detail',
      data,
    );
  }
  // 商品修改
  public static async productModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/modify',
      data,
    );
  }
  // 基于商品标签信息查询商品信息
  public static async productLabelNum(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/product-label/list',
      data,
    );
  }
  // 商品信息批量删除
  public static async productRemove(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/remove',
      data,
    );
  }
  // 商品标签和商品信息绑定接口（多对多绑定和多对多解绑）
  public static async productLabelBind(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/label/bind',
      data,
    );
  }
  // 商品标签和商品信息绑定接口（多对多绑定和多对多解绑）
  public static async productBind(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-label/product/bind',
      data,
    );
  }
  // 查询商品一级分类信息（分页）
  public static async productGroupFirst(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-group/first/page-list',
      data,
    );
  }
  // 库存变更日志
  public static async inventoryChangeLog(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/inventory-change-log/page-list',
      data,
    );
  }
  // 仓库下商品资料分页查询
  public static async warehouseProductPageList(data: any, customerHeader = {}) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/product/page-list',
      data,
      customerHeader,
    );
  }
  // SKU
  // 基础商品信息分页查询
  public static async productProfilePageList(data: ProductInfoQueryParams) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-info/page-list',
      data,
    );
  }
  // 商品规格值信息修改
  public static async productInfoModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-info/modify',
      data,
    );
  }
  //商品规格值列表
  public static async productSpecValueList(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-spec-value/list',
      data,
    );
  }
  //创建商品规格值
  public static async productSpecValueCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-spec-value/create',
      data,
    );
  }
  //修改商品规格值
  public static async productSpecValueModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-spec-value/modify',
      data,
    );
  }
  //删除商品规格值
  public static async productSpecValueRemove(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-spec-value/remove',
      data,
    );
  }
  //商品规格列表
  public static async productSpecList(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-spec/list',
      data,
    );
  }
  //创建商品规格
  public static async productSpecCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-spec/create',
      data,
    );
  }
  //修改商品规格
  public static async productSpecModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-spec/modify',
      data,
    );
  }
  //基础商品信息创建
  public static async productProfileCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-profile/create',
      data,
    );
  }
  //基础商品信息分页
  public static async productProfileSKUPageList(
    data: ProductProfileQueryParams,
  ) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-profile/page-list',
      data,
    );
  }
  //基础商品信息修改
  public static async productProfileModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-profile/modify',
      data,
    );
  }
  //基础商品信息详情
  public static async productProfileDetail(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product-profile/detail',
      data,
    );
  }
  //库存信息分页查询列表
  public static async stockInfoPageList(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/stock-info/page-list',
      data,
    );
  }
  //库存信息创建接口
  public static async stockInfoCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/stock-info/create/batch',
      data,
    );
  }
  //搜索商品相关信息
  public static async productSearch(data: any) {
    return requestClient.post('/v1/merchant/basics/inventory/search', data);
  }
}
