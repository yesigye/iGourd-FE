import type {
  DeleteFinanceCategoryPayload,
  DetailFinanceCategoryPayload,
  FinanceCategoryListPayload,
  FinanceCategoryPayload,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取财务分类列表
export function getFinanceCategoryListApi(data: FinanceCategoryListPayload) {
  if (Reflect.get(data, 'type') === 'ALL') {
    delete data.type;
  }
  return requestClient.post(
    `/v1/merchant/basics/accounting/finance-category/page-list`,
    data,
  );
}

// 创建财务分类
export function createFinanceCategoryApi(data: FinanceCategoryPayload) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/finance-category/create`,
    data,
  );
}

// 更新财务分类
export function updateFinanceCategoryApi(data: FinanceCategoryPayload) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/finance-category/modify`,
    data,
  );
}

// 删除财务分类
export function deleteFinanceCategoryApi(data: DeleteFinanceCategoryPayload) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/finance-category/remove`,
    data,
  );
}

// 获取财务分类详情
export function getFinanceCategoryDetailApi(
  data: DetailFinanceCategoryPayload,
) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/finance-category/detail`,
    data,
  );
}
