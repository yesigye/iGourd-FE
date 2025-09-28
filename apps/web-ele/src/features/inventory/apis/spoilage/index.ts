import type {
  SpoilageDetailParams,
  SpoilageDetailResponse,
  SpoilageParams,
  SpoilageResponse,
} from '../../types/spoilage';

import { requestClient as request } from '#/api/request';

/**
 * 获取库存损耗列表
 */
export function getSpoilageList(params: SpoilageParams) {
  return request.post<SpoilageResponse>(
    '/v1/merchant/basics/inventory/stock-consumption/page-list',
    params,
  );
}

/**
 * 获取库存损耗详情
 */
export function getSpoilageDetail(params: SpoilageDetailParams) {
  return request.post<SpoilageDetailResponse>(
    '/v1/merchant/basics/inventory/stock-consumption/detail',
    params,
  );
}

/**
 * 删除库存损耗
 */
export function removeSpoilage(params: {
  merchant_id: number;
  stock_consumption_ids: number[];
}) {
  return request.post(
    '/v1/merchant/basics/inventory/stock-consumption/remove',
    params,
  );
}

/**
 * 创建库存损耗
 */
export function createSpoilage(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/stock-consumption/create',
    data,
  );
}

/**
 * 更新库存损耗
 *
 *
 */
export function modifySpoilage(data: any) {
  return request.post(
    '/v1/merchant/basics/inventory/stock-consumption/modify',
    data,
  );
}

/**
 * 审核通过库存损耗
 */
export function approveSpoilage(params: {
  id: number;
  merchant_id: number;
  review_opinion?: string;
}) {
  return request.post(
    '/v1/merchant/basics/inventory/stock-consumption/status/approved',
    params,
  );
}

/**
 * 审核拒绝库存损耗
 */
export function rejectSpoilage(params: {
  id: number;
  merchant_id: number;
  review_opinion?: string;
}) {
  return request.post(
    '/v1/merchant/basics/inventory/stock-consumption/status/rejected',
    params,
  );
}

/**
 * 打印库存损耗单
 */
export function printSpoilage(params: {
  merchant_id: number;
  stock_consumption_id: number;
}) {
  return request.post('/inventory/spoilage/print', params);
}
