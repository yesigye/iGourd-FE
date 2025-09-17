import { requestClient as request } from '#/api/request';

// 商品自定义属性相关 API
export const inventoryProductFeatureApi = {
  // 获取自定义属性列表
  getDynamicColumnList: (params: any) => {
    return request({
      url: '/inventory/product-feature/list',
      method: 'get',
      params
    });
  },

  // 创建自定义属性
  createDynamicColumn: (data: any) => {
    return request({
      url: '/inventory/product-feature/create',
      method: 'post',
      data
    });
  },

  // 更新自定义属性
  updateDynamicColumn: (data: any) => {
    return request({
      url: '/inventory/product-feature/update',
      method: 'put',
      data
    });
  },

  // 删除自定义属性
  deleteDynamicColumn: (data: any) => {
    return request({
      url: '/inventory/product-feature/delete',
      method: 'delete',
      data
    });
  },

  // 获取自定义属性详情
  getDynamicColumnDetail: (id: string) => {
    return request({
      url: `/inventory/product-feature/${id}`,
      method: 'get'
    });
  }
};
