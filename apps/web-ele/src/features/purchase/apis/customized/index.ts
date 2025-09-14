import { requestClient } from '#/api/request';
import type { CustomizedDTO } from '../../hooks';
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

export function createOrUpdateCustomizedField(
  data: CustomizedDTO,
) {
  const optionNames =
    data.selectionOptions
      ?.map((option) => option.name)
      .filter((name) => name.trim()) || [];

  const formattedValues = {
    ...data,
    options: data.type === 'SELECT' ? JSON.stringify(optionNames) : '',
  };
  if (data.id) {
    return updateCustomizedField(formattedValues);
  } else {
    return createCustomizedField(formattedValues);
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
