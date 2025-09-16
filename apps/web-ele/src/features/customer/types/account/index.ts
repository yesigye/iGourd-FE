// 账户类型枚举
export enum AccountType {
  REVENUE = 'REVENUE', // 收入
  EXPENDITURE = 'EXPENDITURE', // 支出
}

// 查询参数
export interface CustomerAccountQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  merchant_id?: number;
}

// 分页响应
export interface CustomerAccountPageModel {
  id: number;
  customer_name: string;
  phone_no: string;
  type: AccountType;
  revenue: number;
  expenditures: number;
  date: string;
  remark: string;
  transaction_number: string;
  balance: number;
  creator: string;
  create_time: string;
}

// 创建参数
export interface CustomerAccountCreateVO {
  customer_id: number;
  type: AccountType;
  amount: number;
  date: string;
  remark?: string;
  transaction_number?: string;
  merchant_id?: number;
}

// 修改参数
export interface CustomerAccountModifyVO {
  account_id: number;
  type?: AccountType;
  amount?: number;
  date?: string;
  remark?: string;
  transaction_number?: string;
  merchant_id?: number;
}

// 删除参数
export interface CustomerAccountRemoveVO {
  account_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface CustomerAccountDetailModel {
  id: number;
  customer_id: number;
  customer_name: string;
  phone_no: string;
  type: AccountType;
  amount: number;
  date: string;
  remark: string;
  transaction_number: string;
  balance: number;
  creator: string;
  create_time: string;
}
