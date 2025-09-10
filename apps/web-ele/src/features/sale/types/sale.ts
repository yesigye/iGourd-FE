// ==================== 基础类型 ====================

export interface SaleInfo {
  id: string;
  customer_id: string;
  customer_name: string;
  sale_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface SaleOrderInfo {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface RefundOrderInfo {
  id: string;
  sale_id: string;
  refund_amount: number;
  refund_reason: string;
  status: string;
  create_time: string;
  update_time: string;
}

export interface SaleReturnedInfo {
  id: string;
  sale_id: string;
  returned_no: string;
  returned_date: string;
  total_amount: number;
  status: string;
  reason: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface SaleScanInfo {
  id: string;
  product_id: string;
  product_name: string;
  barcode: string;
  quantity: number;
  scan_time: string;
  operator: string;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface SaleShiftsInfo {
  id: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  operator: string;
  total_sales: number;
  total_orders: number;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface SaleEnterInfo {
  id: string;
  customer_id: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  enter_date: string;
  operator: string;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

// ==================== 查询参数类型 ====================

export interface SalePageQueryParams {
  customer_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface SaleOrderPageQueryParams {
  sale_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface RefundOrderPageQueryParams {
  sale_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface SaleReturnedPageQueryParams {
  sale_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface SaleScanPageQueryParams {
  product_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface SaleShiftsPageQueryParams {
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface SaleEnterPageQueryParams {
  customer_id?: string;
  product_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
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

export interface SaleFormData {
  id?: string;
  customer_id: string;
  sale_date: string;
  total_amount: number;
  status: string;
  remark?: string;
}

export interface SaleOrderFormData {
  id?: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  remark?: string;
}

export interface RefundOrderFormData {
  id?: string;
  sale_id: string;
  refund_amount: number;
  refund_reason: string;
  status: string;
}

export interface SaleReturnedFormData {
  id?: string;
  sale_id: string;
  returned_no: string;
  returned_date: string;
  total_amount: number;
  status: string;
  reason: string;
  remark?: string;
}

export interface SaleScanFormData {
  id?: string;
  product_id: string;
  barcode: string;
  quantity: number;
  scan_time: string;
  operator: string;
  status: string;
  remark?: string;
}

export interface SaleShiftsFormData {
  id?: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  operator: string;
  status: string;
  remark?: string;
}

export interface SaleEnterFormData {
  id?: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  enter_date: string;
  operator: string;
  status: string;
  remark?: string;
}

// ==================== 枚举类型 ====================

export enum SaleStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum RefundStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum ReturnedStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum ScanStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

export enum ShiftsStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

export enum EnterStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

// ==================== 选项类型 ====================

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SaleStatusOption extends SelectOption {
  value: SaleStatus;
}

export interface OrderStatusOption extends SelectOption {
  value: OrderStatus;
}

export interface RefundStatusOption extends SelectOption {
  value: RefundStatus;
}

export interface ReturnedStatusOption extends SelectOption {
  value: ReturnedStatus;
}

export interface ScanStatusOption extends SelectOption {
  value: ScanStatus;
}

export interface ShiftsStatusOption extends SelectOption {
  value: ShiftsStatus;
}

export interface EnterStatusOption extends SelectOption {
  value: EnterStatus;
}