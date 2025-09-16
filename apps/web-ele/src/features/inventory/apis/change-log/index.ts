import { request } from '@/utils/request';
import type { ChangeLogParams, ChangeLogResponse, ChangeLogItem } from '../../types/change-log';

/**
 * 获取库存变更日志列表
 */
export function getInventoryChangeLogList(params: ChangeLogParams) {
  return request.post<ChangeLogResponse>('/inventory/change-log/list', params);
}

/**
 * 获取库存变更日志详情
 */
export function getInventoryChangeLogDetail(params: { id: number; merchant_id: number }) {
  return request.post<ChangeLogItem>('/inventory/change-log/detail', params);
}

/**
 * 导出库存变更日志
 */
export function exportInventoryChangeLog(params: ChangeLogParams) {
  return request.post('/inventory/change-log/export', params, {
    responseType: 'blob'
  });
}

/**
 * 获取变更类型统计
 */
export function getChangeTypeStatistics(params: { merchant_id: number; start_time?: string; end_time?: string }) {
  return request.post<{ [key: string]: number }>('/inventory/change-log/statistics', params);
}
