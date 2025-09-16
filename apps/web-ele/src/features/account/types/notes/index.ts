// 记账笔记分页查询请求参数
export interface GetFinanceNoteListRequest {
  // 记账单号
  accounting_note_no?: string;
  // AccountingChangeTypeEnum:财务变动类型(REVENUE:收入,EXPENDITURE:支出)
  change_type?: 'EXPENDITURE' | 'REVENUE';
  // TradeChannelEnum:销售渠道(POS:销售点,WEB:后台,APP:手机APP)
  channel?: 'APP' | 'POS' | 'WEB';
  // 设备编码(冗余字段)
  device_code?: string;
  // 设备ID
  device_id?: number;
  // 交易结束时间
  end_time?: Date;
  // 财务分类ID集合
  finance_category_id_list?: number[];
  // 主键id集合
  id_list?: number[];
  // 关键字
  keywords?: string;
  // 关联商户ID
  merchant_id?: number;
  // 当前页码
  page_num?: number;
  // 每页条数
  page_size?: number;
  // ReviewStatusEnum:审核状态(PENDING:等待中,APPROVED:审核通过,REJECTED:审核拒绝)
  review_status_list?: string[];
  // 交易开始时间
  start_time?: Date;
}

// 记账笔记分页查询返回模型
export interface AccountingNotePageModel {
  // 关联帐套ID(account_set.id)
  account_set_id?: number;
  // 记账单号
  accounting_note_no?: string;
  // 会计期间(eg:2023-01)
  accounting_period?: string;
  // 关联会计期间ID(accounting_period.id)
  accounting_period_id?: number;
  // 收入/支出金额
  amount?: number;
  // 附件地址
  attachment_url?: string;
  // AccountLedgerBalanceDirectionEnum:科目余额方向枚举(DEBIT:借方向,CREDIT:贷方向)
  balance_direction?: 'CREDIT' | 'DEBIT';
  // AccountingChangeTypeEnum:财务变动类型(REVENUE:收入,EXPENDITURE:支出)
  change_type?: 'EXPENDITURE' | 'REVENUE';
  // TradeChannelEnum:销售渠道(POS:销售点,WEB:后台,APP:手机APP)
  channel?: 'APP' | 'POS' | 'WEB';
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // 创建人名称
  creator_name?: string;
  // 结算货币编码
  currency_code?: string;
  // 设备编码(冗余字段)
  device_code?: string;
  // 设备ID
  device_id?: number;
  // 汇率
  exchange_rate?: AmountRes;
  // 支出金额
  expenditure_amount?: number;
  // 关联财务分类ID(finance_category.id)
  finance_category_id?: number;
  // 财务分类名称
  finance_category_name?: string;
  // ID
  id?: number;
  // 关联商户ID(merchant_info.id)
  merchant_id?: number;
  // 更新时间
  modify_time?: Date;
  // 我方账户名称
  our_account_name?: string;
  // 我方支付方式名称
  our_payment_method_name?: string;
  // 付款人名称
  payer_name?: string;
  // 备注
  remark?: string;
  // 收入金额
  revenue_amount?: number;
  // 审核人ID
  review_id?: number;
  // 审核意见
  review_opinion?: string;
  // ReviewStatusEnum:审核状态(PENDING:等待中,APPROVED:审核通过,REJECTED:审核拒绝)
  review_status?: 'APPROVED' | 'PENDING' | 'REJECTED';
  // 审核时间
  review_time?: Date;
  // 审核人名称
  reviewer_name?: string;
  // 目标账户ID
  target_account_id?: number;
  // 目标科目ID
  target_account_ledger_id?: number;
  // 目标科目名称
  target_account_name?: string;
  // AccountLedgerBalanceNodeTypeEnum:结点类型枚举(ACCOUNT:账户,LEDGER:科目)
  target_node_type?: 'ACCOUNT' | 'LEDGER';
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 交易时间
  trading_time?: Date;
  // 时间戳
  version?: string;
}

// 记账笔记审核请求接收参数VO
export interface AccountingNoteReviewVO {
  // 主键ID
  id: number;
  // 关联商户ID
  merchant_id?: number;
  // 审核意见
  review_opinion?: string;
  // 审核状态(PENDING:等待中,APPROVED:审核通过,REJECTED:审核拒绝)
  review_status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

// 创建记账笔记请求参数
export interface CreateNoteRequest {
  // 关联帐套ID(account_set.id)
  account_set_id: number;
  // 记账单号
  accounting_note_no?: string;
  // 会计期间(eg:2023-01)
  accounting_period: string;
  // 关联会计期间ID(accounting_period.id)
  accounting_period_id: number;
  // 附件地址
  attachment_url?: string;
  // AccountLedgerBalanceDirectionEnum:科目余额方向枚举(DEBIT:借方向,CREDIT:贷方向)
  balance_direction: 'CREDIT' | 'DEBIT';
  // AccountingChangeTypeEnum:财务变动类型(REVENUE:收入,EXPENDITURE:支出)
  change_type: 'EXPENDITURE' | 'REVENUE';
  // TradeChannelEnum:销售渠道(POS:销售点,WEB:后台,APP:手机APP)
  channel: 'APP' | 'POS' | 'WEB';
  // 结算货币编码
  currency_code: string;
  // 设备编码(冗余字段)
  device_code: string;
  // 设备ID
  device_id: number;
  // 汇率
  exchange_rate?: number;
  // 支出金额
  expenditure_amount?: number;
  // 关联财务分类ID(finance_category.id)
  finance_category_id: number;
  // 记账笔记我方账户详情
  item_create_volist?: any[];
  // 关联商户ID
  merchant_id?: number;
  // 付款人名称
  payer_name: string;
  // 备注
  remark?: string;
  // 收入金额
  revenue_amount?: number;
  // ReviewStatusEnum:审核状态(PENDING:等待中,APPROVED:审核通过,REJECTED:审核拒绝)
  review_status?: 'APPROVED' | 'PENDING' | 'REJECTED';
  // 目标账户ID,如果targetNodeType=ACCOUNT,强校验
  target_account_id?: number;
  // 目标科目ID
  target_account_ledger_id: number;
  // AccountLedgerBalanceNodeTypeEnum:结点类型枚举(ACCOUNT:账户,LEDGER:科目)
  target_node_type: 'ACCOUNT' | 'LEDGER';
  // 交易时间
  trading_time?: Date;
}

// 金额响应模型
export interface AmountRes {
  accuracy?: number;
  cent_int_value?: number;
  cent_long_value?: number;
  negative?: boolean;
  positive?: boolean;
  value?: number;
  zero?: boolean;
}

// 分页结果模型
export interface PaginationResultModelAccountingNotePageModel {
  // 分页数据
  list?: AccountingNotePageModel[];
  // 当前页码
  page_num?: number;
  // 每页条数
  page_size?: number;
  // 总页数
  pages?: number;
  // 数据总条数
  total?: number;
}

// 获取记账笔记列表响应
export interface GetFinanceNoteListResponse {
  code?: string;
  data?: PaginationResultModelAccountingNotePageModel;
  message?: string;
  result?: string;
}

// 抽屉传输数据
export interface NotesDrawerTransferData {
  type: 'add' | 'edit' | 'details';
  id?: number;
}
