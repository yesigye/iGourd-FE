import type {
  UnitFormData,
  UnitItem,
  UnitParams,
  UnitResponse,
} from '../../types/unit';

import { requestClient as request } from '#/api/request';

/**
 * 获取单位列表
 */
export function getUnitList(params: UnitParams) {
  return request.post<UnitResponse>('/inventory/unit/list', params);
}

/**
 * 获取单位详情
 */
export function getUnitDetail(params: { id: number; merchant_id: number }) {
  return request.post<UnitItem>('/inventory/unit/detail', params);
}

/**
 * 删除单位
 */
export function deleteUnit(params: {
  merchant_id: number;
  product_unit_id_list: number[];
}) {
  return request.post('/inventory/unit/delete', params);
}

/**
 * 创建单位
 */
export function createUnit(data: UnitFormData) {
  return request.post('/inventory/unit/create', data);
}

/**
 * 更新单位
 */
export function updateUnit(data: UnitFormData) {
  return request.post('/inventory/unit/update', data);
}

/**
 * 更新单位状态
 */
export function updateUnitStatus(params: {
  id: number;
  merchant_id: number;
  status: 'ACTIVE' | 'FROZEN';
}) {
  return request.post('/inventory/unit/update-status', params);
}

/**
 * 检查单位是否被使用
 */
export function checkUnitUsage(params: { id: number; merchant_id: number }) {
  return request.post<{ isUsed: boolean; usageCount: number }>(
    '/inventory/unit/check-usage',
    params,
  );
}
