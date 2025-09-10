// ==================== 基础类型 ====================

export interface AccountInfo {
  id: string;
  account_name: string;
  account_type: string;
  balance: number;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface AccountManagementInfo {
  id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  parent_account: string;
  balance_direction: string;
  current_balance: number;
  status: string;
  create_time: string;
  update_time: string;
}

export interface ChartOfAccountsInfo {
  id: string;
  code: string;
  name: string;
  balance_direction: string;
  initial_balance: number;
  cumulative_debit_amount: number;
  cumulative_credit_amount: number;
  current_balance: number;
  source_type: string;
  create_time: string;
  update_time: string;
}

export interface CollectionVoucherInfo {
  id: string;
  voucher_no: string;
  customer_id: string;
  customer_name: string;
  voucher_date: string;
  amount: number;
  payment_method: string;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface AccountCurrencyInfo {
  id: string;
  currency_code: string;
  currency_name: string;
  symbol: string;
  exchange_rate: number;
  is_base_currency: boolean;
  status: string;
  create_time: string;
  update_time: string;
}

export interface AccountExchangeInfo {
  id: string;
  from_currency: string;
  to_currency: string;
  exchange_rate: number;
  effective_date: string;
  status: string;
  create_time: string;
  update_time: string;
}

export interface AccountFinalTransferInfo {
  id: string;
  transfer_no: string;
  from_account: string;
  to_account: string;
  amount: number;
  transfer_date: string;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface AccountFlowsInfo {
  id: string;
  account_name: string;
  transaction_type: string;
  amount: number;
  balance_after: number;
  transaction_date: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface AccountNotesInfo {
  id: string;
  note_no: string;
  account_name: string;
  note_type: string;
  amount: number;
  note_date: string;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface AccountSubsidiaryLedgerInfo {
  id: string;
  account_code: string;
  account_name: string;
  subsidiary_name: string;
  balance: number;
  status: string;
  create_time: string;
  update_time: string;
}

export interface AccountTaxInfo {
  id: string;
  tax_code: string;
  tax_name: string;
  tax_rate: number;
  tax_type: string;
  status: string;
  create_time: string;
  update_time: string;
}

export interface AccountClassificationInfo {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  status: string;
  create_time: string;
  update_time: string;
}

// ==================== 查询参数类型 ====================

export interface AccountPageQueryParams {
  account_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountManagementPageQueryParams {
  account_type?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface ChartOfAccountsPageQueryParams {
  category?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface CollectionVoucherPageQueryParams {
  customer_id?: string;
  status?: string;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountCurrencyPageQueryParams {
  currency_code?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountExchangePageQueryParams {
  from_currency?: string;
  to_currency?: string;
  status?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountFinalTransferPageQueryParams {
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountFlowsPageQueryParams {
  transaction_type?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountNotesPageQueryParams {
  note_type?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountSubsidiaryLedgerPageQueryParams {
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountTaxPageQueryParams {
  tax_type?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface AccountClassificationPageQueryParams {
  category?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

// ==================== 响应类型 ====================

export interface BackendListResponse<T> {
  data: T[];
  total: number;
  page_num: number;
  page_size: number;
}

export interface BackendResponseRaw<T> {
  code: string;
  message: string;
  data: T;
}

export interface BackendPageResponse<T> {
  code: string;
  message: string;
  data: {
    list: T[];
    total: number;
    page_num: number;
    page_size: number;
  };
}

// ==================== 表单数据类型 ====================

export interface AccountFormData {
  id?: string;
  account_name: string;
  account_type: string;
  balance: number;
  status: string;
  remark?: string;
}

export interface AccountManagementFormData {
  id?: string;
  account_code: string;
  account_name: string;
  account_type: string;
  parent_account?: string;
  balance_direction: string;
  current_balance?: number;
  status: string;
}

export interface ChartOfAccountsFormData {
  id?: string;
  code: string;
  name: string;
  balance_direction: string;
  initial_balance?: number;
  source_type?: string;
}

export interface CollectionVoucherFormData {
  id?: string;
  voucher_no: string;
  customer_id: string;
  voucher_date: string;
  amount: number;
  payment_method: string;
  status: string;
  remark?: string;
}

export interface AccountCurrencyFormData {
  id?: string;
  currency_code: string;
  currency_name: string;
  symbol: string;
  exchange_rate: number;
  is_base_currency?: boolean;
  status: string;
}

export interface AccountExchangeFormData {
  id?: string;
  from_currency: string;
  to_currency: string;
  exchange_rate: number;
  effective_date: string;
  status: string;
}

export interface AccountFinalTransferFormData {
  id?: string;
  transfer_no: string;
  from_account: string;
  to_account: string;
  amount: number;
  transfer_date: string;
  status: string;
  remark?: string;
}

export interface AccountFlowsFormData {
  id?: string;
  account_name: string;
  transaction_type: string;
  amount: number;
  balance_after?: number;
  transaction_date: string;
  description?: string;
}

export interface AccountNotesFormData {
  id?: string;
  note_no: string;
  account_name: string;
  note_type: string;
  amount: number;
  note_date: string;
  status: string;
  remark?: string;
}

export interface AccountSubsidiaryLedgerFormData {
  id?: string;
  account_code: string;
  account_name: string;
  subsidiary_name: string;
  balance?: number;
  status: string;
}

export interface AccountTaxFormData {
  id?: string;
  tax_code: string;
  tax_name: string;
  tax_rate: number;
  tax_type: string;
  status: string;
}

export interface AccountClassificationFormData {
  id?: string;
  code: string;
  name: string;
  category: string;
  description?: string;
  status: string;
}

// ==================== 枚举类型 ====================

export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
}

export enum AccountManagementType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  REVENUE = 'revenue',
  EXPENSE = 'expense',
}

export enum BalanceDirection {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  CREDIT_CARD = 'credit_card',
  OTHER = 'other',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum NoteType {
  COLLECTION = 'collection',
  PAYMENT = 'payment',
  TRANSFER = 'transfer',
}

export enum TaxType {
  VAT = 'vat',
  INCOME = 'income',
  BUSINESS = 'business',
  OTHER = 'other',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum SourceType {
  SYSTEM = 'system',
  MANUAL = 'manual',
}

// ==================== 选项类型 ====================

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface AccountTypeOption extends SelectOption {
  value: AccountType;
}

export interface AccountManagementTypeOption extends SelectOption {
  value: AccountManagementType;
}

export interface BalanceDirectionOption extends SelectOption {
  value: BalanceDirection;
}

export interface PaymentMethodOption extends SelectOption {
  value: PaymentMethod;
}

export interface TransactionTypeOption extends SelectOption {
  value: TransactionType;
}

export interface NoteTypeOption extends SelectOption {
  value: NoteType;
}

export interface TaxTypeOption extends SelectOption {
  value: TaxType;
}

export interface StatusOption extends SelectOption {
  value: Status;
}

export interface SourceTypeOption extends SelectOption {
  value: SourceType;
}
