import { requestClient as request } from '#/api/request';

// 商品分组相关 API
export const inventoryProductGroupApi = {
  // 获取一级分组列表
  getFirstGroupList: (params: any) => {
    return request({
      url: '/inventory/product-group/first-list',
      method: 'get',
      params
    });
  },

  // 获取二级分组列表
  getSecondGroupList: (params: any) => {
    return request({
      url: '/inventory/product-group/second-list',
      method: 'get',
      params
    });
  },

  // 创建分组
  createGroup: (data: any) => {
    return request({
      url: '/inventory/product-group/create',
      method: 'post',
      data
    });
  },

  // 更新分组
  updateGroup: (data: any) => {
    return request({
      url: '/inventory/product-group/update',
      method: 'put',
      data
    });
  },

  // 删除分组
  deleteGroup: (data: any) => {
    return request({
      url: '/inventory/product-group/delete',
      method: 'delete',
      data
    });
  },

  // 获取分组详情
  getGroupDetail: (id: string) => {
    return request({
      url: `/inventory/product-group/${id}`,
      method: 'get'
    });
  }
};
