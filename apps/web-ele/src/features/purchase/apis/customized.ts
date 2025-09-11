import { requestClient } from '#/api/request';

/*
  删除动态属性的参数
*/
interface DynamicAttributeDeleteParams {
  dynamic_column_id_list?: Array<number>; // 动态属性ID列表
  merchant_id?: number; // 商户ID
}

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
export function deleteDynamicColumn(data: DynamicAttributeDeleteParams) {
  return requestClient.post(`/v1/merchant/basics/dynamic-column/remove`, data);
}
