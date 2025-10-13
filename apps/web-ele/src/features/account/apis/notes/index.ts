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

export function createOrUpdateAccountingNote(data: CreateNoteRequest) {
  const {
    // @ts-ignore
    external_account_data: [first],
  } = data;
  data = {
    ...data,
    ...first,
  };
  if (Reflect.has(data, 'id')) {
    return modifyAccountingNoteApi(data);
  }
  return createAccountingNoteApi(data);
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
  data = {
    ...data,
    //@ts-ignore
    item_modify_volist: data.item_create_volist,
  };
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-note/modify`,
    data,
  );
}

export function getAccountingNoteDetail(data: any) {
  return requestClient
    .post('/v1/merchant/basics/accounting/accounting-note/detail', {
      accounting_note_id: data.id,
    })
    .then((res) => {
      return {
        ...res,
        item_create_volist: res.item_detail_models,
        external_account_data: [
          {
            target_account_id: res.target_account_id,
            target_account_ledger_id: res.target_account_ledger_id,
            target_account_name: res.target_account_name,
            target_node_type: res.target_node_type,
          },
        ],
      };
    });
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
