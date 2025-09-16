import type {
  SubsidiaryLedgerQueryPageVO,
  SubsidiaryLedgerPageModel,
  AccountLedgerBalanceTreeModel,
} from '@/apis/accounting/type';

// 查询参数
export interface SubsidiaryLedgerQueryParams {
  page_num: number;
  page_size: number;
  account_set_id?: number;
  account_ledger_ids?: number[];
  account_id?: number;
  end_accounting_period?: string;
  start_accounting_period?: string;
  merchant_id?: number;
}

// 搜索参数
export interface SubsidiaryLedgerSearchParams {
  filterText?: string;
  periodsRange?: string[];
  selectedTabType?: string;
}

// 选中的树节点
export type SelectedTreeNode = AccountLedgerBalanceTreeModel['account_ledger'];

// 重新导出原有类型
export type {
  SubsidiaryLedgerQueryPageVO,
  SubsidiaryLedgerPageModel,
  AccountLedgerBalanceTreeModel,
};
