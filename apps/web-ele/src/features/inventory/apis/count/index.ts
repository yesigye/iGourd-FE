import { request } from '@/utils/request';

// 库存盘点相关 API
export const inventoryCountApi = {
  // 获取库存盘点列表
  getCountList: (params: any) => {
    return request({
      url: '/inventory/count/list',
      method: 'get',
      params
    });
  },

  // 获取库存盘点详情
  getCountDetail: (params: any) => {
    return request({
      url: '/inventory/count/detail',
      method: 'get',
      params
    });
  },

  // 创建库存盘点
  createCount: (data: any) => {
    return request({
      url: '/inventory/count/create',
      method: 'post',
      data
    });
  },

  // 更新库存盘点
  updateCount: (data: any) => {
    return request({
      url: '/inventory/count/update',
      method: 'put',
      data
    });
  },

  // 删除库存盘点
  deleteCount: (data: any) => {
    return request({
      url: '/inventory/count/delete',
      method: 'delete',
      data
    });
  },

  // 更新盘点状态
  updateCountStatus: (data: any) => {
    return request({
      url: '/inventory/count/status',
      method: 'put',
      data
    });
  },

  // 导出库存盘点
  exportCount: (params: any) => {
    return request({
      url: '/inventory/count/export',
      method: 'post',
      data: params,
      responseType: 'blob'
    });
  }
};