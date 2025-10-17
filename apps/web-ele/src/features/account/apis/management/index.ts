import type { AccountCreateVO, AccountRemoveVO } from '@@/account/types';

import { requestClient } from '#/api/request';

// 获取账户管理分页列表
export function getAccountManagementListApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account/page-list`,
    data,
  );
}
export function getAccountManagementOptionList(data: any) {
  return getAccountManagementListApi(data).then((res) => {
    return {
      ...res,
      list: res.list?.map((i) => {
        return {
          ...i,
          label: i.name,
          value: i.id,
        };
      }),
    };
  });
}

// // 创建账户
// export function createAccountApi(data: AccountCreateVO) {
//   return requestClient.post(
//     `/v1/merchant/basics/accounting/account/create`,
//     data,
//   );
// }

// 更新账户
export function updateAccountApi(data: AccountCreateVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account/modify`,
    data,
  );
}

// 删除账户
export function removeAccountApi(data: AccountRemoveVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account/remove`,
    data,
  );
}

// 获取账户详情
export function getAccountDetailApi(account_id: number | string) {
  return requestClient.post(`/v1/merchant/basics/accounting/account/detail`, {
    account_id,
  });
}

// 更新账户状态
export function updateAccountStatusApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account/update-status`,
    data,
  );
}
