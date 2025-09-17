import type {
  OperationLogQueryPageVO,
  OperationLogPageModel,
} from '@@/employee/types';

import { requestClient } from '#/api/request';

// 获取操作日志分页列表
export function getOperationLogPageListApi(data: OperationLogQueryPageVO) {
  return requestClient.post(
    `/v1/merchant/employee/operation-log/page-list`,
    data,
  );
}
