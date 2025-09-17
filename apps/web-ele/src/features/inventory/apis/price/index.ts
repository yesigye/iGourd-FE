import { requestClient } from '#/api/request';

// 获取价格变更日志列表
export function getPriceChangeLogList(params: any) {
  return requestClient.get('/inventory/price-change-log/list', { params });
}

// 获取价格变更日志详情
export function getPriceChangeLogDetail(id: string) {
  return requestClient.get(`/inventory/price-change-log/${id}`);
}

// 导出价格变更日志
export function exportPriceChangeLog(params: any) {
  return requestClient.post('/inventory/price-change-log/export', params, {
    responseType: 'blob',
  });
}
