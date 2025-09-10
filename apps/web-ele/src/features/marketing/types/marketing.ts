// ==================== 基础类型 ====================

export interface MarketingInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface MarketingActivityInfo {
  id: string;
  activity_name: string;
  activity_type: string;
  start_date: string;
  end_date: string;
  status: string;
  target_customers: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface MarketingCouponInfo {
  id: string;
  coupon_name: string;
  coupon_type: string;
  discount_type: string;
  discount_value: number;
  min_amount: number;
  max_amount: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface MarketingPromotionInfo {
  id: string;
  promotion_name: string;
  promotion_type: string;
  start_date: string;
  end_date: string;
  status: string;
  target_products: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface DiscountInfo {
  id: string;
  name: string;
  discount_type: string;
  discount_value: number;
  min_amount: number;
  max_amount: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

export interface PriceInfo {
  id: string;
  product_id: string;
  product_name: string;
  price_type: string;
  price: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  create_time: string;
  update_time: string;
}

// ==================== 查询参数类型 ====================

export interface MarketingPageQueryParams {
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface MarketingActivityPageQueryParams {
  activity_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface MarketingCouponPageQueryParams {
  coupon_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface MarketingPromotionPageQueryParams {
  promotion_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface DiscountPageQueryParams {
  discount_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  keywords?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
}

export interface PricePageQueryParams {
  product_id?: string;
  price_type?: string;
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

export interface MarketingFormData {
  id?: string;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  description?: string;
}

export interface MarketingActivityFormData {
  id?: string;
  activity_name: string;
  activity_type: string;
  start_date: string;
  end_date: string;
  status: string;
  target_customers: string;
  description?: string;
}

export interface MarketingCouponFormData {
  id?: string;
  coupon_name: string;
  coupon_type: string;
  discount_type: string;
  discount_value: number;
  min_amount: number;
  max_amount: number;
  start_date: string;
  end_date: string;
  status: string;
  description?: string;
}

export interface MarketingPromotionFormData {
  id?: string;
  promotion_name: string;
  promotion_type: string;
  start_date: string;
  end_date: string;
  status: string;
  target_products: string;
  description?: string;
}

export interface DiscountFormData {
  id?: string;
  name: string;
  discount_type: string;
  discount_value: number;
  min_amount: number;
  max_amount: number;
  start_date: string;
  end_date: string;
  status: string;
  description?: string;
}

export interface PriceFormData {
  id?: string;
  product_id: string;
  price_type: string;
  price: number;
  start_date: string;
  end_date: string;
  status: string;
  description?: string;
}

// ==================== 枚举类型 ====================

export enum MarketingType {
  ACTIVITY = 'activity',
  COUPON = 'coupon',
  PROMOTION = 'promotion',
  DISCOUNT = 'discount',
  PRICE = 'price',
}

export enum ActivityType {
  NEW_CUSTOMER = 'new_customer',
  LOYALTY = 'loyalty',
  SEASONAL = 'seasonal',
  CLEARANCE = 'clearance',
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
  BUY_ONE_GET_ONE = 'buy_one_get_one',
}

export enum PromotionType {
  BUY_MORE_SAVE_MORE = 'buy_more_save_more',
  BUNDLE_DEAL = 'bundle_deal',
  FLASH_SALE = 'flash_sale',
  MEMBER_EXCLUSIVE = 'member_exclusive',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_X_GET_Y = 'buy_x_get_y',
}

export enum PriceType {
  REGULAR = 'regular',
  SALE = 'sale',
  WHOLESALE = 'wholesale',
  MEMBER = 'member',
}

export enum Status {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// ==================== 选项类型 ====================

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface MarketingTypeOption extends SelectOption {
  value: MarketingType;
}

export interface ActivityTypeOption extends SelectOption {
  value: ActivityType;
}

export interface CouponTypeOption extends SelectOption {
  value: CouponType;
}

export interface PromotionTypeOption extends SelectOption {
  value: PromotionType;
}

export interface DiscountTypeOption extends SelectOption {
  value: DiscountType;
}

export interface PriceTypeOption extends SelectOption {
  value: PriceType;
}

export interface StatusOption extends SelectOption {
  value: Status;
}