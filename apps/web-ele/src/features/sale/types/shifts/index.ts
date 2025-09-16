// 班次状态枚举
export enum ShiftStatus {
  ACTIVE = 'ACTIVE', // 进行中
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
}

// 班次类型枚举
export enum ShiftType {
  MORNING = 'MORNING', // 早班
  AFTERNOON = 'AFTERNOON', // 中班
  EVENING = 'EVENING', // 晚班
  NIGHT = 'NIGHT', // 夜班
}

// 查询参数
export interface SaleShiftsQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: ShiftStatus;
  shift_type?: ShiftType;
  staff_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface SaleShiftsPageModel {
  id: number;
  shift_no: string;
  staff_name: string;
  shift_type: ShiftType;
  status: ShiftStatus;
  start_time: string;
  end_time?: string;
  total_sales: number;
  total_orders: number;
  cash_amount: number;
  card_amount: number;
  remark?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface SaleShiftsCreateVO {
  staff_id: number;
  shift_type: ShiftType;
  start_time: string;
  end_time?: string;
  remark?: string;
  merchant_id?: number;
}

// 修改参数
export interface SaleShiftsModifyVO {
  shift_id: number;
  staff_id?: number;
  shift_type?: ShiftType;
  start_time?: string;
  end_time?: string;
  remark?: string;
  merchant_id?: number;
}

// 删除参数
export interface SaleShiftsRemoveVO {
  shift_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface SaleShiftsDetailModel {
  id: number;
  shift_no: string;
  staff_id: number;
  staff_name: string;
  shift_type: ShiftType;
  status: ShiftStatus;
  start_time: string;
  end_time?: string;
  total_sales: number;
  total_orders: number;
  cash_amount: number;
  card_amount: number;
  remark?: string;
  creator_name: string;
  create_time: string;
}
