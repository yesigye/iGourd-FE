// 店铺创建状态枚举
export enum StoreCreateStatus {
  DRAFT = 'DRAFT', // 草稿
  SUBMITTED = 'SUBMITTED', // 已提交
  REVIEWING = 'REVIEWING', // 审核中
  APPROVED = 'APPROVED', // 已通过
  REJECTED = 'REJECTED', // 已拒绝
  COMPLETED = 'COMPLETED', // 已完成
}

// 店铺创建步骤枚举
export enum StoreCreateStep {
  BASIC_INFO = 'BASIC_INFO', // 基本信息
  EDITION = 'EDITION', // 版本选择
  PACKAGE = 'PACKAGE', // 套餐选择
  PAYMENT = 'PAYMENT', // 支付
  COMPLETE = 'COMPLETE', // 完成
}

// 查询参数
export interface StoreCreateQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: StoreCreateStatus;
  step?: StoreCreateStep;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface StoreCreatePageModel {
  id: number;
  store_name: string;
  store_code: string;
  status: StoreCreateStatus;
  current_step: StoreCreateStep;
  progress: number;
  create_date: string;
  submit_date?: string;
  approve_date?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface StoreCreateCreateVO {
  store_name: string;
  store_code: string;
  store_type: string;
  address: string;
  city: string;
  phone: string;
  manager_id: number;
  description?: string;
  merchant_id?: number;
}

// 修改参数
export interface StoreCreateModifyVO {
  create_id: number;
  store_name?: string;
  store_code?: string;
  store_type?: string;
  address?: string;
  city?: string;
  phone?: string;
  manager_id?: number;
  description?: string;
  merchant_id?: number;
}

// 删除参数
export interface StoreCreateRemoveVO {
  create_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface StoreCreateDetailModel {
  id: number;
  store_name: string;
  store_code: string;
  store_type: string;
  status: StoreCreateStatus;
  current_step: StoreCreateStep;
  progress: number;
  address: string;
  city: string;
  phone: string;
  manager_id: number;
  manager_name: string;
  description?: string;
  create_date: string;
  submit_date?: string;
  approve_date?: string;
  creator_name: string;
  create_time: string;
}

// 店铺创建步骤模型
export interface StoreCreateStepModel {
  step: StoreCreateStep;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  disabled: boolean;
}
