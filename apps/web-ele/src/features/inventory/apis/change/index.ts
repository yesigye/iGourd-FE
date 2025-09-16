import { request } from '@/utils/request';

// 库存变更日志相关 API
export const inventoryChangeApi = {
  // 获取库存变更日志列表
  getInventoryChangeLogList: (params: any) => {
    return request({
      url: '/inventory/stock-change-log/list',
      method: 'get',
      params
    });
  },

  // 获取库存变更日志详情
  getInventoryChangeLogDetail: (id: string) => {
    return request({
      url: `/inventory/stock-change-log/${id}`,
      method: 'get'
    });
  },

  // 导出库存变更日志
  exportInventoryChangeLog: (params: any) => {
    return request({
      url: '/inventory/stock-change-log/export',
      method: 'post',
      data: params,
      responseType: 'blob'
    });
  }
};
