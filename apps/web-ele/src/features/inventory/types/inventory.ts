// ==================== 基础类型 ====================

export interface InventoryInfo {
  id: string;
  product_id: string;
  product_code: string;
  major_name: string;
  product_spec_kvmessage: string;
  profile_photo: string;
  selling_price: number;
  stock_quantity: number;
  major_unit_name: string;
  product_group_name: string;
  review_status: string;
  audit_status: string;
  warehouse_id: string;
  warehouse_name: string;
  warehouse_location_id: string;
  sku_barcode: string;
  merchant_id: string;
  create_time: string;
  update_time: string;
}

export interface InventoryChangeInfo {
  id: string;
  product_id: string;
  product_name: string;
  warehouse_id: string;
  warehouse_name: string;
  change_type: string;
  change_quantity: number;
  before_quantity: number;
  after_quantity: number;
  change_reason: string;
  operator: string;
  change_date: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface InventoryCountInfo {
  id: string;
  warehouse_id: string;
  warehouse_name: string;
  count_date: string;
  total_products: number;
  counted_products: number;
  status: string;
  operator: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface InventoryPriceInfo {
  id: string;
  product_id: string;
  product_name: string;
  warehouse_id: string;
  warehouse_name: string;
  cost_price: number;
  selling_price: number;
  wholesale_price: number;
  retail_price: number;
  status: string;
  effective_date: string;
  create_time: string;
  update_time: string;
}

export interface ProductSpecInfo {
  id: string;
  product_id: string;
  product_name: string;
  spec_name: string;
  spec_value: string;
  sku_code: string;
  barcode: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  status: string;
  create_time: string;
  update_time: string;
}

export interface SkuListInfo {
  id: string;
  product_id: string;
  product_name: string;
  sku_code: string;
  barcode: string;
  spec_info: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  warehouse_id: string;
  warehouse_name: string;
  status: string;
  create_time: string;
  update_time: string;
}

export interface InventorySpoilageInfo {
  id: string;
  product_id: string;
  product_name: string;
  warehouse_id: string;
  warehouse_name: string;
  spoilage_quantity: number;
  spoilage_reason: string;
  spoilage_date: string;
  operator: string;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface InventoryTransferInfo {
  id: string;
  product_id: string;
  product_name: string;
  from_warehouse_id: string;
  from_warehouse_name: string;
  to_warehouse_id: string;
  to_warehouse_name: string;
  transfer_quantity: number;
  transfer_date: string;
  operator: string;
  status: string;
  remark: string;
  create_time: string;
  update_time: string;
}

export interface InventoryUnitInfo {
  id: string;
  unit_name: string;
  unit_code: string;
  conversion_rate: number;
  base_unit: string;
  status: string;
  create_time: string;
  update_time: string;
}

export interface WarehouseInfo {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  status: string;
  create_time: string;
  update_time: string;
}

export interface ProductInfo {
  id: string;
  product_name: string;
  product_code: string;
  major_name: string;
  selling_price: number;
  profile_photo: string;
  product_group_id: string;
  product_group_name: string;
  status: string;
  create_time: string;
  update_time: string;
}

// ==================== 查询参数类型 ====================

export interface InventoryPageQueryParams {
  warehouse_ids?: string[];
  product_id?: string;
  product_group_id?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface InventoryChangePageQueryParams {
  product_id?: string;
  warehouse_id?: string;
  change_type?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface InventoryCountPageQueryParams {
  warehouse_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface InventoryPricePageQueryParams {
  product_id?: string;
  warehouse_id?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface ProductSpecPageQueryParams {
  product_id?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface SkuListPageQueryParams {
  product_id?: string;
  warehouse_id?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface InventorySpoilagePageQueryParams {
  product_id?: string;
  warehouse_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface InventoryTransferPageQueryParams {
  product_id?: string;
  from_warehouse_id?: string;
  to_warehouse_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface InventoryUnitPageQueryParams {
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface WarehousePageQueryParams {
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface ProductPageQueryParams {
  product_group_id?: string;
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

export interface InventoryFormData {
  id?: string;
  product_id: string;
  warehouse_id: string;
  stock_quantity: number;
  selling_price: number;
  remark?: string;
}

export interface InventoryChangeFormData {
  id?: string;
  product_id: string;
  warehouse_id: string;
  change_type: string;
  change_quantity: number;
  change_reason: string;
  operator: string;
  change_date: string;
  remark?: string;
}

export interface InventoryCountFormData {
  id?: string;
  warehouse_id: string;
  count_date: string;
  operator: string;
  remark?: string;
}

export interface InventoryPriceFormData {
  id?: string;
  product_id: string;
  warehouse_id: string;
  cost_price: number;
  selling_price: number;
  wholesale_price: number;
  retail_price: number;
  effective_date: string;
}

export interface ProductSpecFormData {
  id?: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  sku_code: string;
  barcode: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
}

export interface SkuListFormData {
  id?: string;
  product_id: string;
  sku_code: string;
  barcode: string;
  spec_info: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  warehouse_id: string;
}

export interface InventorySpoilageFormData {
  id?: string;
  product_id: string;
  warehouse_id: string;
  spoilage_quantity: number;
  spoilage_reason: string;
  spoilage_date: string;
  operator: string;
  remark?: string;
}

export interface InventoryTransferFormData {
  id?: string;
  product_id: string;
  from_warehouse_id: string;
  to_warehouse_id: string;
  transfer_quantity: number;
  transfer_date: string;
  operator: string;
  remark?: string;
}

export interface InventoryUnitFormData {
  id?: string;
  unit_name: string;
  unit_code: string;
  conversion_rate: number;
  base_unit: string;
}

export interface WarehouseFormData {
  id?: string;
  name: string;
  address: string;
  contact_person: string;
  contact_phone: string;
}

export interface ProductFormData {
  id?: string;
  product_name: string;
  product_code: string;
  major_name: string;
  selling_price: number;
  profile_photo: string;
  product_group_id: string;
}

// ==================== 枚举类型 ====================

export enum ChangeType {
  IN = 'in',
  OUT = 'out',
  TRANSFER = 'transfer',
  ADJUST = 'adjust',
  SPOILAGE = 'spoilage',
}

export enum CountStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TransferStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum SpoilageStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum AuditStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// ==================== 选项类型 ====================

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface ChangeTypeOption extends SelectOption {
  value: ChangeType;
}

export interface CountStatusOption extends SelectOption {
  value: CountStatus;
}

export interface TransferStatusOption extends SelectOption {
  value: TransferStatus;
}

export interface SpoilageStatusOption extends SelectOption {
  value: SpoilageStatus;
}

export interface ReviewStatusOption extends SelectOption {
  value: ReviewStatus;
}

export interface AuditStatusOption extends SelectOption {
  value: AuditStatus;
}

export interface StatusOption extends SelectOption {
  value: Status;
}