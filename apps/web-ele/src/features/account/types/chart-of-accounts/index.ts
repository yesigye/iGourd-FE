import type {
  AccountBalanceInfoResponseModel,
  AccountCreateVO,
  AccountDetailModel,
  AccountingPeriodCurrentQueryVO,
  AccountingPeriodModel,
  AccountLedgerBalanceDirectionEnum,
  AccountLedgerBalanceModifyVO,
  AccountLedgerBalanceTreeModel,
  AccountLedgerBalanceTreeQueryVO,
  AccountLedgerCategoryEnum,
  AccountLedgerCreateVO,
  AccountLedgerDetailModel,
  AccountLedgerModel,
  AccountLedgerModifyVO,
  AccountLedgerRemoveVO,
  AccountModifyVO,
  AccountRemoveVO,
  AccountSetDetailModel,
  FindCurrentPeriodPayload,
  SubsidiaryLedgerPageModel,
  SubsidiaryLedgerQueryPageVO,
} from '@/apis/accounting/type';

// 科目类型枚举
export enum LedgerType {
  account = 'ledger',
  subLedger = 'subLedger',
}

// 标签页类型
export enum TabType {
  asset = 'asset',
  equity = 'equity',
  expense = 'expense',
  liability = 'liability',
  profitAndLoss = 'profitAndLoss',
  revenue = 'revenue',
}

// 抽屉类型
export enum DrawerType {
  add = 'add',
  detail = 'detail',
  edit = 'edit',
}

// 输入列键
export enum InputColumnKey {
  cumulativeCredit = 'cumulative_credit_amount',
  cumulativeDebit = 'cumulative_debit_amount',
  openingBalance = 'initial_balance',
}

// 搜索关键字
export enum SearchKeyword {
  accountCode = 'code',
  accountName = 'name',
}

// 科目传输数据
export type LedgerTransferData<Row = any> = {
  ledgerType: LedgerType;
  row?: Row;
  type: DrawerType;
};

// 表格数据类型
export type TableData = Pick<
  AccountLedgerBalanceTreeModel,
  'account_ledger'
> & {
  sub_ledger_trees?: (AccountBalanceInfoResponseModel | TableData)[];
};

// 余额方向简写
type BalanceDirectionShort = 'CR' | 'DR';

// 科目表单数据
export interface AccountLedgerFormData {
  account_ledger_id: string;
  balance_direction_sort: BalanceDirectionShort;
  category: AccountLedgerCategoryEnum;
  code: string;
  currency_code: string;
  current_balance: string;
  initial_balance: string;
  name: string;
}

// 特性类型
interface FeaturesType {
  quantityAccounting: boolean;
}

// 创建科目时的表单数据
export interface CreateAccountLedgerFormData {
  balance_direction: AccountLedgerBalanceDirectionEnum;
  category: AccountLedgerCategoryEnum;
  code: string;
  features_type: FeaturesType;
  is_enabled: boolean;
  merchant_id: string;
  name: string;
  parent_id: string;
}

// 查询参数
export interface ChartOfAccountsQueryParams {
  category: TabType;
  merchant_id?: number;
  account_set_id?: number;
}

// 搜索参数
export interface ChartOfAccountsSearchParams {
  keywords?: string;
  [key: string]: any;
}

// 导出参数
export interface ChartOfAccountsExportParams {
  tableKey: string;
  fileName: string;
  conditionParams: ChartOfAccountsQueryParams;
  table_multi_headers: Array<{
    field_key: string;
    header_names: string[];
  }>;
}

// 重新导出原有类型
export type {
  AccountBalanceInfoResponseModel,
  AccountCreateVO,
  AccountDetailModel,
  AccountingPeriodCurrentQueryVO,
  AccountingPeriodModel,
  AccountLedgerBalanceDirectionEnum,
  AccountLedgerBalanceModifyVO,
  AccountLedgerBalanceTreeModel,
  AccountLedgerBalanceTreeQueryVO,
  AccountLedgerCategoryEnum,
  AccountLedgerCreateVO,
  AccountLedgerDetailModel,
  AccountLedgerModel,
  AccountLedgerModifyVO,
  AccountLedgerRemoveVO,
  AccountModifyVO,
  AccountRemoveVO,
  AccountSetDetailModel,
  FindCurrentPeriodPayload,
  SubsidiaryLedgerPageModel,
  SubsidiaryLedgerQueryPageVO,
};
