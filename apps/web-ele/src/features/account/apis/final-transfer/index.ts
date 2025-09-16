import type {
  FinalTransferQueryParams,
  FinalTransferData,
  FinalTransferCreateVO,
  FinalTransferRemoveVO,
  FinalTransferDetailModel,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取期末结转列表
export function getFinalTransferListApi(data: FinalTransferQueryParams) {
  return requestClient.post(
    `/merchant/basics/accounting/final-transfer/list`,
    data,
  );
}

// 执行期末结转
export function executeFinalTransferApi(data: FinalTransferCreateVO) {
  return requestClient.post(
    `/merchant/basics/accounting/final-transfer/execute`,
    data,
  );
}

// 撤销期末结转
export function reverseFinalTransferApi(data: FinalTransferRemoveVO) {
  return requestClient.post(
    `/merchant/basics/accounting/final-transfer/reverse`,
    data,
  );
}

// 获取期末结转详情
export function getFinalTransferDetailApi(data: { transfer_id: number; merchant_id?: number }) {
  return requestClient.post(
    `/merchant/basics/accounting/final-transfer/detail`,
    data,
  );
}

// 获取结转状态
export function getTransferStatusApi(data: { period_id: number; merchant_id?: number }) {
  return requestClient.post(
    `/merchant/basics/accounting/final-transfer/status`,
    data,
  );
}
