// import type { MerchantDetailResponse } from '@@/store/types/create';

import type { MerchantPackageListRequest } from '@@/store/types';

/**
 * 商户创建
 */
import { requestClient as request } from '#/api/request';

export function basicsMerchantSubMerchantCreate(data: any) {
  return request.post('/v1/merchant/basics/merchant/sub-merchant/create', data);
}

// 商户所有子商户信息查询（分页）
export function basicsMerchantSubMerchantPageList(data: any) {
  return request.post(
    '/v1/merchant/basics/merchant/sub-merchant/page-list',
    data,
  );
}

// 商户套餐查询(适用于3种套餐场景：NEW:新购,RENEW:续费复购,UPGRADE:套餐升级)
export function basicsMerchantPackageList(data: MerchantPackageListRequest) {
  return request.post('/v1/merchant/basics/merchant/package/list', data);
}

// 商户下单(选择套餐下单，适用于：NEW:新购,RENEW:续费复购,UPGRADE:套餐升级)
export function basicsMerchantPackagePlaceOrder(data: any) {
  return request.post('/v1/merchant/basics/merchant/package/place-order', data);
}

// 基于入网id, 获取入网信息详情 商户入网详情查询请求接收参数
export function basicsMerchantMerchantEnrollFind(data: {
  // 一级商户ID(当前登录id)
  first_level_merchant_id?: number;
  // 套餐业务类型
  package_business_type: 'NEW' | 'RENEW' | 'UPGRADE';
  // 商户ID(要查询的二级商户ID)
  sub_merchant_id: number;
}) {
  return request.post(
    '/v1/merchant/basics/merchant/merchant-enroll/find',
    data,
  );
}

// 子商户信息修改
export function basicsMerchantSubMerchantModify(data: any) {
  return request.post('/v1/merchant/basics/merchant/sub-merchant/modify', data);
}

// 商户入网审核历史记录查询(创建商户)
export function basicsMerchantReviewLogList(data: any) {
  return request.post('/v1/merchant/basics/merchant/review-log/list', data);
}

// 基于商户套餐完成付款动作，更新付款完成的状态(适用于：NEW:新购,RENEW:续费复购,UPGRADE:套餐升级)
export function basicsMerchantPackagePaid(data: any) {
  return request.post('/v1/merchant/basics/merchant/package/paid', data);
}

// 商户订单付费记录信息查询(分页)
export function basicsMerchantOrderPaymentPageList(data: any) {
  return request.post('/v1/merchant/basics/merchant/order/page-list', data);
}

// 商户设备授权分页查询接口
export function basicsMerchantDevicePageList(data: any) {
  return request.post('/v1/merchant/basics/merchant/device/page-list', data);
}

// 当前门店信息修改
export function basicsMerchantStoreModify(data: any) {
  return request.post(
    '/v1/merchant/basics/merchant/current-merchant/modify',
    data,
  );
}
// 当前门店信息修改
export function basicsMerchantfind(merchantId: number | string) {
  return request.get(`/v1/merchant/basics/merchant/find/${merchantId}`);
}
