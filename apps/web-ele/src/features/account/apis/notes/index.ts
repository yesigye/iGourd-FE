import type {
  AccountingNoteReviewVO,
  CreateNoteRequest,
  GetFinanceNoteListRequest,
} from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取记账笔记分页列表
export function getFinanceNoteListApi(data: GetFinanceNoteListRequest) {
  if (Reflect.get(data, 'change_type') === 'ALL') {
    delete data.change_type;
  }
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-note/page-list`,
    data,
  );
}

// 创建记账笔记
export function createAccountingNoteApi(data: CreateNoteRequest) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-note/create`,
    data,
  );
}

// 修改记账笔记
export function modifyAccountingNoteApi(data: CreateNoteRequest) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-note/modify`,
    data,
  );
}

// 删除记账笔记
export function removeAccountingNoteApi(data: {
  accounting_note_id_list: number[];
  merchant_id?: number;
}) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-note/remove`,
    data,
  );
}

// 审核记账笔记
export function reviewAccountingNoteApi(data: AccountingNoteReviewVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-note/review`,
    data,
  );
}
