import type {
  listPageFinanceFlowPayload,
  listPageFinanceFlowResponse,
  FinanceFlowPlusQueryPageVO,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取财务流水分页列表
export function getFinanceFlowPageListApi(data: FinanceFlowPlusQueryPageVO) {
  return requestClient.post(
    `/v1/v1/merchant/basics/accounting/finance-flow-plus/page-list`,
    data,
  );
}

// 获取财务流水列表
export function getFinanceFlowListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/finance-flow/page-list`,
    data,
  );
}

// 获取财务流水合计
export function getFinanceFlowTotalApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/finance-flow/total`,
    data,
  );
}
