// ==================== 基础类型 ====================

export interface PurchaseInfo {
  id: string;
  vendor_id: string;
  vendor_name: string;
  purchase_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface PurchaseOrderInfo {
  id: string;
  purchase_id: string;
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

export interface PurchaseReceiptInfo {
  id: string;
  purchase_id: string;
  receipt_no: string;
  receipt_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface PurchaseReturnedInfo {
  id: string;
  purchase_id: string;
  returned_no: string;
  returned_date: string;
  total_amount: number;
  status: string;
  reason: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface PurchaseBillsInfo {
  id: string;
  purchase_id: string;
  bill_no: string;
  bill_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface PurchaseCustomizedInfo {
  id: string;
  vendor_id: string;
  vendor_name: string;
  customized_no: string;
  customized_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface PurchaseNewOrderInfo {
  id: string;
  vendor_id: string;
  vendor_name: string;
  order_no: string;
  order_date: string;
  total_amount: number;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface PurchaseNewOrderHistoryInfo {
  id: string;
  order_id: string;
  order_no: string;
  action: string;
  action_date: string;
  operator: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface VendorInfo {
  id: string;
  name: string;
  contact_person: string;
  contact_phone: string;
  email: string;
  address: string;
  status: string;
  create_time: string;
  update_time: string;
}

// ==================== 查询参数类型 ====================

export interface PurchasePageQueryParams {
  vendor_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PurchaseOrderPageQueryParams {
  purchase_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PurchaseReceiptPageQueryParams {
  purchase_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PurchaseReturnedPageQueryParams {
  purchase_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PurchaseBillsPageQueryParams {
  purchase_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PurchaseCustomizedPageQueryParams {
  vendor_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PurchaseNewOrderPageQueryParams {
  vendor_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PurchaseNewOrderHistoryPageQueryParams {
  order_id?: string;
  action?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface VendorPageQueryParams {
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

export interface PurchaseFormData {
  id?: string;
  vendor_id: string;
  purchase_date: string;
  total_amount: number;
  status: string;
  remark?: string;
}

export interface PurchaseOrderFormData {
  id?: string;
  purchase_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  remark?: string;
}

export interface PurchaseReceiptFormData {
  id?: string;
  purchase_id: string;
  receipt_no: string;
  receipt_date: string;
  total_amount: number;
  status: string;
  remark?: string;
}

export interface PurchaseReturnedFormData {
  id?: string;
  purchase_id: string;
  returned_no: string;
  returned_date: string;
  total_amount: number;
  status: string;
  reason: string;
  remark?: string;
}

export interface PurchaseBillsFormData {
  id?: string;
  purchase_id: string;
  bill_no: string;
  bill_date: string;
  total_amount: number;
  status: string;
  remark?: string;
}

export interface PurchaseCustomizedFormData {
  id?: string;
  vendor_id: string;
  customized_no: string;
  customized_date: string;
  total_amount: number;
  status: string;
  remark?: string;
}

export interface PurchaseNewOrderFormData {
  id?: string;
  vendor_id: string;
  order_no: string;
  order_date: string;
  total_amount: number;
  status: string;
  remark?: string;
}

export interface PurchaseNewOrderHistoryFormData {
  id?: string;
  order_id: string;
  action: string;
  action_date: string;
  operator: string;
  remark?: string;
}

export interface VendorFormData {
  id?: string;
  name: string;
  contact_person: string;
  contact_phone: string;
  email: string;
  address: string;
  status: string;
}

// ==================== 枚举类型 ====================

export enum PurchaseStatus {
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

export enum ReceiptStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum ReturnedStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum BillsStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum CustomizedStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum NewOrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum HistoryAction {
  CREATED = 'created',
  UPDATED = 'updated',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum VendorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// ==================== 选项类型 ====================

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface PurchaseStatusOption extends SelectOption {
  value: PurchaseStatus;
}

export interface OrderStatusOption extends SelectOption {
  value: OrderStatus;
}

export interface ReceiptStatusOption extends SelectOption {
  value: ReceiptStatus;
}

export interface ReturnedStatusOption extends SelectOption {
  value: ReturnedStatus;
}

export interface BillsStatusOption extends SelectOption {
  value: BillsStatus;
}

export interface CustomizedStatusOption extends SelectOption {
  value: CustomizedStatus;
}

export interface NewOrderStatusOption extends SelectOption {
  value: NewOrderStatus;
}

export interface HistoryActionOption extends SelectOption {
  value: HistoryAction;
}

export interface VendorStatusOption extends SelectOption {
  value: VendorStatus;
}