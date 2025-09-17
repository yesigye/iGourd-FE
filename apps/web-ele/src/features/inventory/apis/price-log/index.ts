import { requestClient as request } from '#/api/request';
import type { PriceLogParams, PriceLogResponse, PriceLogItem } from '../../types/price-log';

/**
 * 获取价格变更日志列表
 */
export function getInventoryPriceLogList(params: PriceLogParams) {
  return request.post<PriceLogResponse>('/v1/merchant/basics/inventory/price-change-log/page-list', params);
}

/**
 * 获取价格变更日志详情
 */
export function getInventoryPriceLogDetail(params: { id: number; merchant_id: number }) {
  return request.post<PriceLogItem>('/inventory/price-log/detail', params);
}

/**
 * 导出价格变更日志
 */
export function exportInventoryPriceLog(params: PriceLogParams) {
  return request.post('/inventory/price-log/export', params, {
    responseType: 'blob'
  });
}

/**
 * 获取价格变更统计
 */
export function getPriceChangeStatistics(params: { merchant_id: number; start_time?: string; end_time?: string }) {
  return request.post<{ [key: string]: number }>('/inventory/price-log/statistics', params);
}
