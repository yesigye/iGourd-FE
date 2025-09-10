// ==================== 基础类型 ====================

export interface StoreInfo {
  id: string;
  name: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface StoreManagementInfo {
  id: string;
  store_id: string;
  store_name: string;
  manager_name: string;
  manager_phone: string;
  management_type: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface StoreSettingsInfo {
  id: string;
  store_id: string;
  store_name: string;
  setting_name: string;
  setting_value: string;
  setting_type: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface StoreStaffInfo {
  id: string;
  store_id: string;
  store_name: string;
  staff_name: string;
  staff_phone: string;
  staff_role: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface DeviceInfo {
  id: string;
  store_id: string;
  store_name: string;
  device_name: string;
  device_type: string;
  device_code: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface PaymentMethodInfo {
  id: string;
  store_id: string;
  store_name: string;
  method_name: string;
  method_type: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

// ==================== 查询参数类型 ====================

export interface StorePageQueryParams {
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface StoreManagementPageQueryParams {
  store_id?: string;
  management_type?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface StoreSettingsPageQueryParams {
  store_id?: string;
  setting_type?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface StoreStaffPageQueryParams {
  store_id?: string;
  staff_role?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface DevicePageQueryParams {
  store_id?: string;
  device_type?: string;
  status?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PaymentMethodPageQueryParams {
  store_id?: string;
  method_type?: string;
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

export interface StoreFormData {
  id?: string;
  name: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  status: string;
  description?: string;
}

export interface StoreManagementFormData {
  id?: string;
  store_id: string;
  manager_name: string;
  manager_phone: string;
  management_type: string;
  status: string;
  description?: string;
}

export interface StoreSettingsFormData {
  id?: string;
  store_id: string;
  setting_name: string;
  setting_value: string;
  setting_type: string;
  status: string;
  description?: string;
}

export interface StoreStaffFormData {
  id?: string;
  store_id: string;
  staff_name: string;
  staff_phone: string;
  staff_role: string;
  status: string;
  description?: string;
}

export interface DeviceFormData {
  id?: string;
  store_id: string;
  device_name: string;
  device_type: string;
  device_code: string;
  status: string;
  description?: string;
}

export interface PaymentMethodFormData {
  id?: string;
  store_id: string;
  method_name: string;
  method_type: string;
  status: string;
  description?: string;
}

// ==================== 枚举类型 ====================

export enum ManagementType {
  GENERAL = 'general',
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  MARKETING = 'marketing',
}

export enum SettingType {
  GENERAL = 'general',
  PAYMENT = 'payment',
  INVENTORY = 'inventory',
  CUSTOMER = 'customer',
  NOTIFICATION = 'notification',
}

export enum StaffRole {
  MANAGER = 'manager',
  CASHIER = 'cashier',
  SALES = 'sales',
  INVENTORY = 'inventory',
  CUSTOMER_SERVICE = 'customer_service',
}

export enum DeviceType {
  POS = 'pos',
  SCANNER = 'scanner',
  PRINTER = 'printer',
  DISPLAY = 'display',
  CARD_READER = 'card_reader',
}

export enum PaymentMethodType {
  CASH = 'cash',
  CARD = 'card',
  MOBILE = 'mobile',
  ONLINE = 'online',
  CREDIT = 'credit',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  MAINTENANCE = 'maintenance',
}

// ==================== 选项类型 ====================

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface ManagementTypeOption extends SelectOption {
  value: ManagementType;
}

export interface SettingTypeOption extends SelectOption {
  value: SettingType;
}

export interface StaffRoleOption extends SelectOption {
  value: StaffRole;
}

export interface DeviceTypeOption extends SelectOption {
  value: DeviceType;
}

export interface PaymentMethodTypeOption extends SelectOption {
  value: PaymentMethodType;
}

export interface StatusOption extends SelectOption {
  value: Status;
}