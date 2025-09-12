import { requestClient } from '#/api/request';

// ==================== 营销管理 APIs ====================

// 获取营销分页列表
export function getMarketingPageListApi(data: any) {
  return requestClient.post(`/merchant/marketing/page-list`, data);
}

// 获取营销列表
export function getMarketingListApi(data: any) {
  return requestClient.post(`/merchant/marketing/list`, data);
}

// 获取营销详情
export function getMarketingDetailApi(id: string) {
  return requestClient.get(`/merchant/marketing/${id}`);
}

// 创建营销
export function createMarketingApi(data: any) {
  return requestClient.post(`/merchant/marketing/marketing`, data);
}

// 更新营销
export function updateMarketingApi(id: string, data: any) {
  return requestClient.put(`/merchant/marketing/${id}`, data);
}

// 删除营销
export function deleteMarketingApi(id: string) {
  return requestClient.delete(`/merchant/marketing/${id}`);
}

// 批量删除营销
export function batchDeleteMarketingApi(ids: string[]) {
  return requestClient.delete(`/merchant/marketing/batch`, { data: { ids } });
}

// 创建或更新营销
export function createOrUpdateMarketingApi(data: any) {
  if (data.id) {
    return updateMarketingApi(data.id, data);
  } else {
    return createMarketingApi(data);
  }
}

// ==================== 折扣管理 APIs ====================

// 获取折扣列表
export function getDiscountListApi(data: any) {
  return requestClient.post(`/merchant/marketing/discount/list`, data);
}

// 获取折扣详情
export function getDiscountDetailApi(id: string) {
  return requestClient.get(`/merchant/marketing/discount/${id}`);
}

// 创建折扣
export function createDiscountApi(data: any) {
  return requestClient.post(`/merchant/marketing/discount`, data);
}

// 更新折扣
export function updateDiscountApi(data: any) {
  return requestClient.put(`/merchant/marketing/discount/${data.id}`, data);
}

// 删除折扣
export function deleteDiscountApi(data: any) {
  return requestClient.delete(`/merchant/marketing/discount/batch`, { data });
}

// 开启折扣状态
export function statusOpenApi(data: any) {
  return requestClient.post(`/merchant/marketing/discount/status/open`, data);
}

// 关闭折扣状态
export function statusCloseApi(data: any) {
  return requestClient.post(`/merchant/marketing/discount/status/close`, data);
}

// ==================== 营销活动 APIs ====================

// 获取营销活动分页列表
export function getMarketingActivityListApi(data: any) {
  return requestClient.post(`/merchant/marketing/activity/page-list`, data);
}

// 获取营销活动详情
export function getMarketingActivityDetailApi(id: string) {
  return requestClient.get(`/merchant/marketing/activity/${id}`);
}

// 创建营销活动
export function createMarketingActivityApi(data: any) {
  return requestClient.post(`/merchant/marketing/activity`, data);
}

// 更新营销活动
export function updateMarketingActivityApi(id: string, data: any) {
  return requestClient.put(`/merchant/marketing/activity/${id}`, data);
}

// 删除营销活动
export function deleteMarketingActivityApi(id: string) {
  return requestClient.delete(`/merchant/marketing/activity/${id}`);
}

// 批量删除营销活动
export function batchDeleteMarketingActivityApi(ids: string[]) {
  return requestClient.delete(`/merchant/marketing/activity/batch`, { data: { ids } });
}

// 创建或更新营销活动
export function createOrUpdateMarketingActivityApi(data: any) {
  if (data.id) {
    return updateMarketingActivityApi(data.id, data);
  } else {
    return createMarketingActivityApi(data);
  }
}

// ==================== 优惠券 APIs ====================

// 获取优惠券分页列表
export function getMarketingCouponListApi(data: any) {
  return requestClient.post(`/merchant/marketing/coupon/page-list`, data);
}

// 获取优惠券详情
export function getMarketingCouponDetailApi(id: string) {
  return requestClient.get(`/merchant/marketing/coupon/${id}`);
}

// 创建优惠券
export function createMarketingCouponApi(data: any) {
  return requestClient.post(`/merchant/marketing/coupon`, data);
}

// 更新优惠券
export function updateMarketingCouponApi(id: string, data: any) {
  return requestClient.put(`/merchant/marketing/coupon/${id}`, data);
}

// 删除优惠券
export function deleteMarketingCouponApi(id: string) {
  return requestClient.delete(`/merchant/marketing/coupon/${id}`);
}

// 批量删除优惠券
export function batchDeleteMarketingCouponApi(ids: string[]) {
  return requestClient.delete(`/merchant/marketing/coupon/batch`, { data: { ids } });
}

// 创建或更新优惠券
export function createOrUpdateMarketingCouponApi(data: any) {
  if (data.id) {
    return updateMarketingCouponApi(data.id, data);
  } else {
    return createMarketingCouponApi(data);
  }
}

// ==================== 促销活动 APIs ====================

// 获取促销活动分页列表
export function getMarketingPromotionListApi(data: any) {
  return requestClient.post(`/merchant/marketing/promotion/page-list`, data);
}

// 获取促销活动详情
export function getMarketingPromotionDetailApi(id: string) {
  return requestClient.get(`/merchant/marketing/promotion/${id}`);
}

// 创建促销活动
export function createMarketingPromotionApi(data: any) {
  return requestClient.post(`/merchant/marketing/promotion`, data);
}

// 更新促销活动
export function updateMarketingPromotionApi(id: string, data: any) {
  return requestClient.put(`/merchant/marketing/promotion/${id}`, data);
}

// 删除促销活动
export function deleteMarketingPromotionApi(id: string) {
  return requestClient.delete(`/merchant/marketing/promotion/${id}`);
}

// 批量删除促销活动
export function batchDeleteMarketingPromotionApi(ids: string[]) {
  return requestClient.delete(`/merchant/marketing/promotion/batch`, { data: { ids } });
}

// 创建或更新促销活动
export function createOrUpdateMarketingPromotionApi(data: any) {
  if (data.id) {
    return updateMarketingPromotionApi(data.id, data);
  } else {
    return createMarketingPromotionApi(data);
  }
}

// 批量删除折扣
export function batchDeleteDiscountApi(ids: string[]) {
  return requestClient.delete(`/merchant/marketing/discount/batch`, { data: { ids } });
}

// 创建或更新折扣
export function createOrUpdateDiscountApi(data: any) {
  if (data.id) {
    return updateDiscountApi(data);
  } else {
    return createDiscountApi(data);
  }
}

// ==================== 价格管理 APIs ====================

// 获取价格分页列表
export function getPriceListApi(data: any) {
  return requestClient.post(`/merchant/marketing/price/page-list`, data);
}

// 获取价格详情
export function getPriceDetailApi(id: string) {
  return requestClient.get(`/merchant/marketing/price/${id}`);
}

// 创建价格
export function createPriceApi(data: any) {
  return requestClient.post(`/merchant/marketing/price`, data);
}

// 更新价格
export function updatePriceApi(id: string, data: any) {
  return requestClient.put(`/merchant/marketing/price/${id}`, data);
}

// 删除价格
export function deletePriceApi(id: string) {
  return requestClient.delete(`/merchant/marketing/price/${id}`);
}

// 批量删除价格
export function batchDeletePriceApi(ids: string[]) {
  return requestClient.delete(`/merchant/marketing/price/batch`, { data: { ids } });
}

// 开启价格状态
export function statusOpenPriceApi(data: any) {
  return requestClient.post(`/merchant/marketing/price/status/open`, data);
}

// 关闭价格状态
export function statusClosePriceApi(data: any) {
  return requestClient.post(`/merchant/marketing/price/status/close`, data);
}

// 创建或更新价格
export function createOrUpdatePriceApi(data: any) {
  if (data.id) {
    return updatePriceApi(data.id, data);
  } else {
    return createPriceApi(data);
  }
}

// ==================== 通用 APIs ====================

// 获取产品列表
export function getProductListApi(data: any) {
  return requestClient.post(`/merchant/basics/inventory/product/page-list`, data);
}

// 获取客户列表
export function getCustomerListApi(data: any) {
  return requestClient.post(`/merchant/customer/customer/page-list`, data);
}

// 导出功能
export function exportMarketingApi(data: any) {
  return requestClient.post(`/merchant/marketing/export`, data);
}

export function exportMarketingActivityApi(data: any) {
  return requestClient.post(`/merchant/marketing/activity/export`, data);
}

export function exportMarketingCouponApi(data: any) {
  return requestClient.post(`/merchant/marketing/coupon/export`, data);
}

export function exportMarketingPromotionApi(data: any) {
  return requestClient.post(`/merchant/marketing/promotion/export`, data);
}

export function exportDiscountApi(data: any) {
  return requestClient.post(`/merchant/marketing/discount/export`, data);
}

export function exportPriceApi(data: any) {
  return requestClient.post(`/merchant/marketing/price/export`, data);
}

// 保持原有的对象导出方式（向后兼容）
export const marketingApi = {
  // 营销管理
  getPageList: getMarketingPageListApi,
  getList: getMarketingListApi,
  getDetail: getMarketingDetailApi,
  create: createMarketingApi,
  update: updateMarketingApi,
  delete: deleteMarketingApi,
  batchDelete: batchDeleteMarketingApi,

  // 营销活动
  getActivityList: getMarketingActivityListApi,
  getActivityDetail: getMarketingActivityDetailApi,
  createActivity: createMarketingActivityApi,
  updateActivity: updateMarketingActivityApi,
  deleteActivity: deleteMarketingActivityApi,
  batchDeleteActivity: batchDeleteMarketingActivityApi,

  // 优惠券
  getCouponList: getMarketingCouponListApi,
  getCouponDetail: getMarketingCouponDetailApi,
  createCoupon: createMarketingCouponApi,
  updateCoupon: updateMarketingCouponApi,
  deleteCoupon: deleteMarketingCouponApi,
  batchDeleteCoupon: batchDeleteMarketingCouponApi,

  // 促销活动
  getPromotionList: getMarketingPromotionListApi,
  getPromotionDetail: getMarketingPromotionDetailApi,
  createPromotion: createMarketingPromotionApi,
  updatePromotion: updateMarketingPromotionApi,
  deletePromotion: deleteMarketingPromotionApi,
  batchDeletePromotion: batchDeleteMarketingPromotionApi,

  // 折扣管理
  getDiscountList: getDiscountListApi,
  getDiscountDetail: getDiscountDetailApi,
  createDiscount: createDiscountApi,
  updateDiscount: updateDiscountApi,
  deleteDiscount: deleteDiscountApi,
  statusOpen: statusOpenApi,
  statusClose: statusCloseApi,

  // 价格管理
  getPriceList: getPriceListApi,
  getPriceDetail: getPriceDetailApi,
  createPrice: createPriceApi,
  updatePrice: updatePriceApi,
  deletePrice: deletePriceApi,
  batchDeletePrice: batchDeletePriceApi,
  statusOpenPrice: statusOpenPriceApi,
  statusClosePrice: statusClosePriceApi,

  // 通用
  getProductList: getProductListApi,
  getCustomerList: getCustomerListApi,
  export: exportMarketingApi,
  exportActivity: exportMarketingActivityApi,
  exportCoupon: exportMarketingCouponApi,
  exportPromotion: exportMarketingPromotionApi,
  exportDiscount: exportDiscountApi,
  exportPrice: exportPriceApi,
};

