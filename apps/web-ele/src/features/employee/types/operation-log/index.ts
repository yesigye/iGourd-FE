// 操作类型枚举
export enum OperationType {
  CREATE = 'CREATE', // 创建
  UPDATE = 'UPDATE', // 更新
  DELETE = 'DELETE', // 删除
  LOGIN = 'LOGIN', // 登录
  LOGOUT = 'LOGOUT', // 登出
}

// 查询参数
export interface OperationLogQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  operator_name?: string;
  operation_type?: OperationType;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface OperationLogPageModel {
  id: number;
  operator_name: string;
  account: string;
  operation_type: OperationType;
  operation_description: string;
  ip_address: string;
  user_agent: string;
  create_time: string;
  status: string;
}
