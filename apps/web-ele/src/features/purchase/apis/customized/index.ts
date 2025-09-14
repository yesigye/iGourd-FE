import { requestClient } from '#/api/request';
import type { DynamicAttributeDeleteParams } from './type';

// 获取定制采购分页列表
export function getPurchaseCustomizedListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/dynamic-column/page-list`,
    data,
  );
}

function createCustomizedField(data: any) {
  return requestClient.post(`/v1/merchant/basics/dynamic-column/create`, data);
}

function updateCustomizedField(data: any) {
  return requestClient.post(`/v1/merchant/basics/dynamic-column/modify`, data);
}

export function createOrUpdateCustomizedField(data: any) {
  if (data.id) {
    return updateCustomizedField(data);
  } else {
    return createCustomizedField(data);
  }
}

/**
 * 删除动态字段
 * @param data
 */
export function deleteDynamicColumn(
  dynamic_column_id_list: (string | number)[],
) {
  return requestClient.post(`/v1/merchant/basics/dynamic-column/remove`, {
    dynamic_column_id_list,
  });
}

export * from './type';
