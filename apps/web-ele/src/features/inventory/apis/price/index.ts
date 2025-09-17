import { requestClient as request } from '#/api/request';

// 库存价格变更相关 API
export const inventoryPriceApi = {
  // 获取价格变更日志列表
  getPriceChangeLogList: (params: any) => {
    return request({
      url: '/inventory/price-change-log/list',
      method: 'get',
      params
    });
  },

  // 获取价格变更日志详情
  getPriceChangeLogDetail: (id: string) => {
    return request({
      url: `/inventory/price-change-log/${id}`,
      method: 'get'
    });
  },

  // 导出价格变更日志
  exportPriceChangeLog: (params: any) => {
    return request({
      url: '/inventory/price-change-log/export',
      method: 'post',
      data: params,
      responseType: 'blob'
    });
  }
};
