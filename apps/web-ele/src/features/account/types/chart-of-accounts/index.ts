import type {
  AccountLedgerBalanceTreeQueryVO,
  AccountLedgerBalanceTreeModel,
  AccountLedgerBalanceModifyVO,
  AccountLedgerRemoveVO,
  AccountRemoveVO,
  AccountLedgerCreateVO,
  AccountLedgerModifyVO,
  AccountLedgerDetailModel,
  AccountDetailModel,
  AccountCreateVO,
  AccountModifyVO,
  AccountLedgerModel,
  AccountSetDetailModel,
  SubsidiaryLedgerQueryPageVO,
  SubsidiaryLedgerPageModel,
  AccountingPeriodCurrentQueryVO,
  AccountingPeriodModel,
  FindCurrentPeriodPayload,
  AccountBalanceInfoResponseModel,
  AccountLedgerBalanceDirectionEnum,
  AccountLedgerCategoryEnum,
} from '@/apis/accounting/type';

// 科目类型枚举
export enum LedgerType {
  account = 'ledger',
  subLedger = 'subLedger',
}

// 标签页类型
export enum TabType {
  asset = 'asset',
  liability = 'liability',
  equity = 'equity',
  revenue = 'revenue',
  expense = 'expense',
  profitAndLoss = 'profitAndLoss',
}

// 抽屉类型
export enum DrawerType {
  add = 'add',
  edit = 'edit',
  detail = 'detail',
}

// 输入列键
export enum InputColumnKey {
  openingBalance = 'initial_balance',
  cumulativeDebit = 'cumulative_debit_amount',
  cumulativeCredit = 'cumulative_credit_amount',
}

// 搜索关键字
export enum SearchKeyword {
  accountCode = 'code',
  accountName = 'name',
}

// 科目传输数据
export type LedgerTransferData<Row = any> = {
  row?: Row;
  type: DrawerType;
  ledgerType: LedgerType;
};

// 表格数据类型
export type TableData = Pick<
  AccountLedgerBalanceTreeModel,
  'account_ledger'
> & {
  sub_ledger_trees?: (TableData | AccountBalanceInfoResponseModel)[];
};

// 余额方向简写
type BalanceDirectionShort = 'DR' | 'CR';

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
  AccountLedgerBalanceTreeQueryVO,
  AccountLedgerBalanceTreeModel,
  AccountLedgerBalanceModifyVO,
  AccountLedgerRemoveVO,
  AccountRemoveVO,
  AccountLedgerCreateVO,
  AccountLedgerModifyVO,
  AccountLedgerDetailModel,
  AccountDetailModel,
  AccountCreateVO,
  AccountModifyVO,
  AccountLedgerModel,
  AccountSetDetailModel,
  SubsidiaryLedgerQueryPageVO,
  SubsidiaryLedgerPageModel,
  AccountingPeriodCurrentQueryVO,
  AccountingPeriodModel,
  FindCurrentPeriodPayload,
  AccountBalanceInfoResponseModel,
  AccountLedgerBalanceDirectionEnum,
  AccountLedgerCategoryEnum,
};
