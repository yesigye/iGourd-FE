// ==================== 基础类型 ====================

export interface ReportInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface CustomerReportInfo {
  id: string;
  customer_id: string;
  customer_name: string;
  total_orders: number;
  total_amount: number;
  last_order_date: string;
  create_time: string;
  update_time: string;
}

export interface FinancialReportInfo {
  id: string;
  date: string;
  income: number;
  expense: number;
  profit: number;
  balance: number;
  create_time: string;
  update_time: string;
}

export interface InventoryReportInfo {
  id: string;
  product_id: string;
  product_name: string;
  product_code: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  status: string;
  create_time: string;
  update_time: string;
}

export interface SalesReportInfo {
  id: string;
  date: string;
  total_orders: number;
  total_amount: number;
  total_quantity: number;
  average_order_value: number;
  create_time: string;
  update_time: string;
}

// ==================== 查询参数类型 ====================

export interface ReportPageQueryParams {
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface CustomerReportPageQueryParams {
  customer_id?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface FinancialReportPageQueryParams {
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface InventoryReportPageQueryParams {
  product_id?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface SalesReportPageQueryParams {
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

export interface ReportFormData {
  id?: string;
  name: string;
  type: string;
  status: string;
  description?: string;
}

export interface CustomerReportFormData {
  id?: string;
  customer_id: string;
  total_orders: number;
  total_amount: number;
  last_order_date: string;
}

export interface FinancialReportFormData {
  id?: string;
  date: string;
  income: number;
  expense: number;
  profit: number;
  balance: number;
}

export interface InventoryReportFormData {
  id?: string;
  product_id: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  status: string;
}

export interface SalesReportFormData {
  id?: string;
  date: string;
  total_orders: number;
  total_amount: number;
  total_quantity: number;
  average_order_value: number;
}

// ==================== 枚举类型 ====================

export enum ReportType {
  CUSTOMER = 'customer',
  FINANCIAL = 'financial',
  INVENTORY = 'inventory',
  SALES = 'sales',
}

export enum ReportStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

// ==================== 选项类型 ====================

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface ReportTypeOption extends SelectOption {
  value: ReportType;
}

export interface ReportStatusOption extends SelectOption {
  value: ReportStatus;
}

export interface InventoryStatusOption extends SelectOption {
  value: InventoryStatus;
}