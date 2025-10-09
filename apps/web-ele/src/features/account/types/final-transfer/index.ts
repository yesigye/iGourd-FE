// 结转类型枚举
export enum TransferType {
  FINAL_PROCESSING = 'finalProcessing', // 期末结转
  REVERSE_CARRYOVER = 'reverseCarryover', // 反结转
}

// 结转状态枚举
export enum TransferStatus {
  CURRENT = 'current', // 当前期间
  PROCESSED = 'processed', // 已结转
  REVERSED = 'reversed', // 已反结转
  UNPROCESSED = 'unprocessed', // 未结转
}

// 查询参数
export interface FinalTransferQueryParams {
  period_id?: number;
  year?: number;
  month?: number;
  merchant_id?: number;
}

// 结转数据
export interface FinalTransferData {
  id: number;
  year: number;
  month: number;
  period_id: number;
  status: TransferStatus;
  is_current: boolean;
  monty_no: string;
  transfer_date?: string;
  creator_name?: string;
  create_time?: string;
}

// 结转创建参数
export interface FinalTransferCreateVO {
  period_id: number;
  transfer_date: string;
  remark?: string;
  merchant_id?: number;
}

// 结转删除参数
export interface FinalTransferRemoveVO {
  transfer_id: number;
  merchant_id?: number;
}

// 结转详情模型
export interface FinalTransferDetailModel {
  id: number;
  period_id: number;
  year: number;
  month: number;
  status: TransferStatus;
  transfer_date: string;
  remark?: string;
  creator_name: string;
  create_time: string;
  account_list: AccountTransferData[];
}

// 账户结转数据
export interface AccountTransferData {
  account_id: number;
  account_code: string;
  account_name: string;
  current_debit_amount: number;
  current_credit_amount: number;
  transfer_debit_amount: number;
  transfer_credit_amount: number;
}

// 结转表单数据
export interface FinalTransferForm {
  period_id: number;
  transfer_date: string;
  remark?: string;
  merchant_id?: number;
}
export enum AccountingPeriodSettlementStatusEnum {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  PROFIT_LOSS_TRANSFERRED = 'PROFIT_LOSS_TRANSFERRED',
  ROLL_BACKED = 'ROLL_BACKED',
}
