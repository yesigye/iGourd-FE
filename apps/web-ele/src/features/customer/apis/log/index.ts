import type { CustomerLabelQueryPageVO } from '@@/customer/types';

import { requestClient } from '#/api/request';

const INTEGRAL_LOG_BASE_URL =
  '/v1/merchant/basics/customer/customer-point-change-log';

// 获取积分变更日志列表
export function getIntegralLogList(data: CustomerLabelQueryPageVO) {
  return requestClient.post(`${INTEGRAL_LOG_BASE_URL}/page-list`, data);
}
