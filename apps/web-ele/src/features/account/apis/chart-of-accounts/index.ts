import type {
  AccountingPeriodCurrentQueryVO,
  AccountLedgerBalanceModifyVO,
  AccountLedgerBalanceTreeQueryVO,
  AccountLedgerCreateVO,
  AccountLedgerModifyVO,
  AccountLedgerRemoveVO,
  AccountModifyVO,
  FindCurrentPeriodPayload,
  SubsidiaryLedgerQueryPageVO,
} from '@@/account/types';

import { requestClient } from '#/api/request';
import Decimal from 'decimal.js';
import { padStart } from '@igourd/utils';

// 转换算法实现
const convertToElTreeFormat = (data: any) => {
  return data.map((item: any) => {
    const node = {
      ...item,
      label: item.name,
      children: [],
    };

    // 递归处理子节点
    if (item.sub_ledger_trees && item.sub_ledger_trees.length > 0) {
      node.children = convertToElTreeFormat(item.sub_ledger_trees);
    }

    return node;
  });
};

// 科目余额树形结构查询
export function getChartOfAccountsTreeApi(
  data: AccountLedgerBalanceTreeQueryVO,
) {
  return requestClient
    .post(
      `/v1/merchant/basics/accounting/account-ledger-balance/tree-list`,
      data,
    )
    .then(convertToElTreeFormat);
}

// 修改科目余额
export function modifyLedgerBalanceApi(data: AccountLedgerBalanceModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger-balance/modify`,
    data,
  );
}

// 创建科目
export function createAccountLedgerApi(data: AccountLedgerCreateVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/create`,
    data,
  );
}

// 删除科目
export function removeAccountLedgerApi(data: AccountLedgerRemoveVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/remove`,
    data,
  );
}

// 获取科目详情
export function getAccountLedgerDetailApi(account_ledger_id: number) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/detail`,
    { account_ledger_id },
  );
}

// 修改科目
export function modifyAccountLedgerApi(data: AccountLedgerModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/modify`,
    data,
  );
}
// 创建账户
export function createAccountApi(data: AccountModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account/create`,
    data,
  );
}

// 修改账户
export function modifyAccountApi(data: AccountModifyVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account/modify`,
    data,
  );
}

// 查询叶子节点科目
export function getLeafLedgersApi(data: {
  account_set_id: number;
  merchant_id?: number;
}) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/leaf-ledgers`,
    data,
  );
}

export function getLeafLedgersOptions(data: any) {
  return requestClient
    .post(`/v1/merchant/basics/accounting/account-ledger/leaf-ledgers`, data)
    .then((res) => {
      return res?.map((it: any) => ({
        ...it,
        label: `${it.name} - ${it.code}`,
        value: it.id,
      }));
    });
}

export function getLeafAccounts(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-ledger/leaf-accounts`,
    data,
  );
}

/** 计算科目的code */
const generateAccountLedgerCode = ({
  children,
  parentCode,
}: {
  children: any;
  parentCode: string;
}) => {
  let max = `${parentCode}001`;
  const leftStart = `${parentCode}`;

  children.forEach((child: any) => {
    const childCode = child.account_ledger.code;
    const codeNum = Decimal(childCode);
    if (
      childCode.startsWith(leftStart) &&
      !codeNum.isNaN() &&
      codeNum.gte(max)
    ) {
      max = codeNum.add(1).toString();
    }
  });

  return max;
};

/** 计算账户的code */
const generateSubLedgerCode = ({
  children,
  parentCode,
}: {
  children: { code: string }[];
  parentCode: string;
}) => {
  let max = `${parentCode}-001`;
  const leftStart = `${parentCode}-`;

  children.forEach((child) => {
    const code = child.code;

    if (code.startsWith(leftStart)) {
      const num = Decimal(code.replace(leftStart, ''));
      const currentMax = max.replace(leftStart, '');
      if (!num.isNaN() && num.gte(currentMax)) {
        // 如果 num 小于 3位，进行左补 0
        max = `${leftStart}${padStart(num.add(1).toString(), 3, '0')}`;
      }
    }
  });

  return max;
};

export function getCodeFromChildren(data: any) {
  const { isAccountLedger } = data;
  if (isAccountLedger) return generateAccountLedgerCode({ ...data });
  return generateSubLedgerCode({ ...data });
}

export async function getMaxCodeLeafAccounts(
  data: any,
  isAccountLedger: boolean,
  parentCode: string,
) {
  const children = await getLeafAccounts(data);
  const max = getCodeFromChildren({
    children,
    isAccountLedger,
    parentCode,
  });
  return max;
}

// 获取账套详情
export function getAccountSetDetailApi(data: {
  id?: number;
  merchant_id?: number;
}) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/account-set/detail`,
    data,
  );
}

// 明细账分页查询
export function getSubsidiaryLedgerPageApi(data: SubsidiaryLedgerQueryPageVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/subsidiary-ledger/page-list`,
    data,
  );
}

// 获取当前会计期间
export function getCurrentPeriodApi(data: FindCurrentPeriodPayload) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-period/current`,
    data,
  );
}

// 获取会计期间列表
export function getAccountingPeriodsApi(data: AccountingPeriodCurrentQueryVO) {
  return requestClient.post(
    `/v1/merchant/basics/accounting/accounting-period/list`,
    data,
  );
}
