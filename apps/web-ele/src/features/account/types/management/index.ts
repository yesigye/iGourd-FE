// 账户信息分页查询请求参数
export interface AccountQueryPageVO {
  // AccountTypeEnum:账户类型枚举(CASH:现金,CARD:银行卡)
  account_type?: 'CARD' | 'CASH' | '';
  // 银行地址
  bank_address?: string;
  // 银行名称
  bank_name?: string;
  // 开户行名称
  branch_name?: string;
  // 关键字
  keywords?: string;
  // 关联商户ID
  merchant_id?: number;
  // 账户名称
  name?: string;
  // 当前页码
  page_num?: number;
  // 每页条数
  page_size?: number;
}

// 账户信息分页查询返回模型
export interface AccountPageModel {
  // 关联科目ID(account_ledger.id)
  account_ledger_id?: number;
  // 科目名称
  account_ledger_name?: string;
  // 关联帐套ID(account_set.id)
  account_set_id?: number;
  // AccountTypeEnum:账户类型枚举(CASH:现金,CARD:银行卡)
  account_type?: 'CARD' | 'CASH';
  // 余额舍弃，后期为当前余额
  balance?: number;
  // 银行账号
  bank_account_number?: string;
  // 银行地址
  bank_address?: string;
  // 银行名称
  bank_name?: string;
  // 账户归属对象ID(如客户ID、供应商ID等)
  belong_id?: number;
  // AccountBelongTypeEnum:账户归属类型枚举(CUSTOMER:客户,VENDOR:供应商,NONE:无)
  belong_type?: 'CUSTOMER' | 'NONE' | 'VENDOR';
  // 开户行名称
  branch_name?: string;
  // 账户编号
  code?: string;
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // 创建人姓名
  creator_name?: string;
  // 结算货币编码
  currency_code?: string;
  // 当前余额(期末的时候,当前余额就是期末余额)
  current_balance?: number;
  // ID
  id?: number;
  // 期初余额
  initial_balance?: number;
  // 是否激活(0:否, 1:是)
  is_active?: boolean;
  // 是否为模板帐套(0:否, 1:是)
  is_template?: boolean;
  // 商户ID(关联)
  merchant_id?: number;
  // 更新时间
  modify_time?: Date;
  // 账户名称
  name?: string;
  // 备注
  remark?: string;
  // SourceTypeEnum:来源类型枚举(SYSTEM:系统默认,CUSTOM:用户自定义)
  source_type?: 'CUSTOM' | 'SYSTEM';
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 时间戳
  version?: string;
}

// 创建商户账户信息请求接收参数
export interface AccountCreateVO {
  // 关联科目ID(account_ledger.id)
  account_ledger_id: number;
  // 关联帐套ID(account_set.id)
  account_set_id?: number;
  // AccountTypeEnum:账户类型枚举(CASH:现金,CARD:银行卡)
  account_type: 'CARD' | 'CASH';
  // 银行账号
  bank_account_number?: string;
  // 银行地址
  bank_address?: string;
  // 银行名称
  bank_name?: string;
  // 账户归属对象ID(如客户ID、供应商ID等)
  belong_id?: number;
  // AccountBelongTypeEnum:账户归属类型枚举(CUSTOMER:客户,VENDOR:供应商,NONE:无)
  belong_type?: 'CUSTOMER' | 'NONE' | 'VENDOR';
  // 开户行名称
  branch_name?: string;
  // 账户编号
  code: string;
  // 结算货币编码
  currency_code?: string;
  // 当前余额(期末的时候,当前余额就是期末余额)
  current_balance: number;
  // 期初余额
  initial_balance: number;
  // 是否激活(0:否, 1:是)
  is_active?: boolean;
  // 是否为模板帐套(0:否, 1:是)
  is_template?: boolean;
  // 关联商户ID
  merchant_id?: number;
  // 账户名称
  name: string;
  // 备注
  remark?: string;
  // SourceTypeEnum:来源类型枚举(SYSTEM:系统默认,CUSTOM:用户自定义)
  source_type?: 'CUSTOM' | 'SYSTEM';
}

// 删除账户信息请求接收参数
export interface AccountRemoveVO {
  // 账户id集合
  account_id_list: number[];
  // 关联商户ID
  merchant_id?: number;
}

// 账户删除请求返回模型
export interface AccountRemoveModel {
  // 删除失败账户信息
  remove_error_models?: AccountRemoveErrorModel[];
  // 成功的账户ID
  success_list?: number[];
}

// 账户信息删除失败的账户返回模型
export interface AccountRemoveErrorModel {
  // 账户编号
  account_code?: string;
  // 账户ID
  account_id?: number;
  // 账户名称
  account_name?: string;
  // 异常信息
  exception_message?: string;
  // AccountRemoveFailReasonEnum:账户删除失败原因枚举
  fail_reason?:
    | 'BALANCE_NOT_ZERO'
    | 'BOUND_TO_BUSINESS'
    | 'BOUND_TO_CUSTOMER_VENDOR'
    | 'HAS_FLOW_RECORD'
    | 'HAS_SUBJECT_BALANCE'
    | 'SYSTEM_INIT'
    | 'UNKNOWN_ERROR';
  // AccountRemoveFailTypeEnum:账户删除失败类型枚举
  fail_type?: 'CANNOT_DELETE' | 'NEED_DISABLE';
  // 失败提示信息
  message?: string;
}

// 抽屉传输数据
export interface DrawerTransferData {
  drawerType: 'add' | 'edit' | 'details';
  accountType: 'CASH' | 'CARD';
  row?: AccountPageModel;
}

// 银行列类型枚举
export enum BankColumnType {
  all = 'all',
  cash = 'cash',
  card = 'card',
}

// 抽屉类型枚举
export enum DrawerType {
  add = 'add',
  edit = 'edit',
  details = 'details',
}

// 账户类型枚举
export enum AccountType {
  CASH = 'CASH',
  CARD = 'CARD',
}
