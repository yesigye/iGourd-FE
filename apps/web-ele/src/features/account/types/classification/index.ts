import type { AccountLedgerModel } from '@@/account/types';

// 财务分类抽屉数据
export type FinanceCategoryDrawer = {
  id?: string;
  type: '';
};

// 列类型枚举
export enum ColumnType {
  ALL = 'ALL',
  EXPENSE = 'EXPENSE',
  REVENUE = 'REVENUE',
}

// 查询参数
export interface ClassificationQueryParams {
  page_num: number;
  page_size: number;
  type: ColumnType;
  keywords: string;
  id_list?: number[];
  create_id_list?: number[];
  merchant_id?: number;
}

// 搜索参数
export interface ClassificationSearchParams {
  keywords?: string;
  tabKey?: ColumnType;
  name?: number[];
  create_id_list?: number[];
}

// 标签页选项
export const tabOptions = [
  { label: 'account.all', value: ColumnType.ALL },
  { label: 'account.revenue', value: ColumnType.REVENUE },
  { label: 'account.expense', value: ColumnType.EXPENSE },
];

// 重新导出原有类型

export interface DeleteFinanceCategoryPayload {
  // 财务分类id集合
  finance_category_id_list: number[];
  // 关联商户ID
  merchant_id?: number;
}
export interface DetailFinanceCategoryPayload {
  // 财务分类主键id
  finance_category_id: number;
  // 关联商户ID
  merchant_id?: number;
}

// 财务分类详情返回模型
export interface FinanceCategoryDetailModel {
  // 科目编码字符串组合(用,分割)
  account_ledger_codes?: string;
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // AccountingExpenditureTypeEnum:财务支出类型枚举(SALES_EXPENSES:销售支出,MANAGEMENT_EXPENSES:管理费用,FINANCIAL_EXPENSES:财务费用,NON_OPERATING_EXPENSES:营业外支出)
  expenditure_type?:
    | 'FINANCIAL_EXPENSES'
    | 'MANAGEMENT_EXPENSES'
    | 'NON_OPERATING_EXPENSES'
    | 'SALES_EXPENSES';
  // ID
  id?: number;
  // 我方科目list集合返回模型
  ledger_list?: AccountLedgerModel[];
  // 商户ID(关联)
  merchant_id?: number;
  // 更新时间
  modify_time?: Date;
  // 财务分类名称
  name?: string;
  // 备注
  remark?: string;
  // 排序
  sort?: number;
  // FinanceCategorySourceTypeEnum:财务分类来源类型(SYSTEM:系统默认,CUSTOM:用户自定义)
  source_type?: 'CUSTOM' | 'SYSTEM';
  // 目标科目编码
  target_account_ledger_code?: string;
  // 目标科目信息
  target_ledger_model?: AccountLedgerModel;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // AccountingChangeTypeEnum:财务类型枚举(REVENUE:收入,EXPENSES:支出)
  type: 'EXPENDITURE' | 'REVENUE';
  // 时间戳
  version?: string;
}
export interface FinanceCategoryListPayload {
  // 创建人ID集合
  create_id_list?: number[];
  // 结束时间
  end_create_time?: Date;
  // AccountingExpenditureTypeEnum:财务支出类型枚举(SALES_EXPENSES:销售支出,MANAGEMENT_EXPENSES:管理费用,FINANCIAL_EXPENSES:财务费用,NON_OPERATING_EXPENSES:营业外支出)
  expenditure_type?:
    | 'FINANCIAL_EXPENSES'
    | 'MANAGEMENT_EXPENSES'
    | 'NON_OPERATING_EXPENSES'
    | 'SALES_EXPENSES';
  // 财务分类主键ID集合
  id_list?: number[];
  // 关键字
  keywords?: string;
  // 关联商户ID
  merchant_id?: number;
  // 财务分类名称
  name?: string;
  // 当前页码
  page_num?: number;
  // 每页条数
  page_size?: number;
  // 开始时间
  start_create_time?: Date;
  // AccountingChangeTypeEnum:财务类型枚举(REVENUE:收入,EXPENSES:支出)
  type?: 'ALL' | 'EXPENDITURE' | 'REVENUE';
}

export interface FinanceCategoryListResponse {
  // 科目编码字符串组合(用,分割)
  account_ledger_codes?: string;
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // 创建人姓名
  creator_name?: string;
  // AccountingExpenditureTypeEnum:财务支出类型枚举(SALES_EXPENSES:销售支出,MANAGEMENT_EXPENSES:管理费用,FINANCIAL_EXPENSES:财务费用,NON_OPERATING_EXPENSES:营业外支出)
  expenditure_type?:
    | 'FINANCIAL_EXPENSES'
    | 'MANAGEMENT_EXPENSES'
    | 'NON_OPERATING_EXPENSES'
    | 'SALES_EXPENSES';
  // ID
  id?: number;
  // 科目名称
  ledger_names?: string;
  // 商户ID(关联)
  merchant_id?: number;
  // 更新时间
  modify_time?: Date;
  // 财务分类名称
  name?: string;
  // 备注
  remark?: string;
  // 排序
  sort?: number;
  // FinanceCategorySourceTypeEnum:财务分类来源类型(SYSTEM:系统默认,CUSTOM:用户自定义)
  source_type?: 'CUSTOM' | 'SYSTEM';
  // 目标科目编码
  target_account_ledger_code?: string;
  // 目标科目名称
  target_ledger_name?: string;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // AccountingChangeTypeEnum:财务类型枚举(REVENUE:收入,EXPENSES:支出)
  type: 'EXPENDITURE' | 'REVENUE';
  // 时间戳
  version?: string;
}

export interface FinanceCategoryPayload {
  // 科目编码字符串组合(用,分割)
  account_ledger_codes?: string;
  // AccountingExpenditureTypeEnum:财务支出类型枚举(SALES_EXPENSES:销售支出,MANAGEMENT_EXPENSES:管理费用,FINANCIAL_EXPENSES:财务费用,NON_OPERATING_EXPENSES:营业外支出)
  expenditure_type?:
    | 'FINANCIAL_EXPENSES'
    | 'MANAGEMENT_EXPENSES'
    | 'NON_OPERATING_EXPENSES'
    | 'SALES_EXPENSES';
  // 关联商户ID
  merchant_id?: number;
  // 财务分类名称
  name: string;
  // 备注
  remark?: string;
  // 排序
  sort?: number;
  // 目标科目编码
  target_account_ledger_code?: string;
  // AccountingChangeTypeEnum:财务类型枚举(REVENUE:收入,EXPENSES:支出)
  type: 'EXPENDITURE' | 'REVENUE';
}
