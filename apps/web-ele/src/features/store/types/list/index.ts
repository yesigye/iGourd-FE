// 店铺状态枚举
export enum StoreStatus {
  ACTIVE = 'ACTIVE', // 营业中
  CLOSED = 'CLOSED', // 已关闭
  INACTIVE = 'INACTIVE', // 停业
  MAINTENANCE = 'MAINTENANCE', // 维护中
}

// 店铺类型枚举
export enum StoreType {
  HYBRID = 'HYBRID', // 混合店
  ONLINE = 'ONLINE', // 网店
  RETAIL = 'RETAIL', // 零售店
  WHOLESALE = 'WHOLESALE', // 批发店
}

// 查询参数
export interface StoreListQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: StoreStatus;
  store_type?: StoreType;
  city?: string;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface StoreListPageModel {
  id: number;
  store_name: string;
  store_code: string;
  store_type: StoreType;
  status: StoreStatus;
  address: string;
  city: string;
  phone: string;
  manager_name: string;
  open_date: string;
  total_sales: number;
  total_orders: number;
  creator_name: string;
  create_time: string;
  business_type: string;
}

// 创建参数
export interface StoreListCreateVO {
  store_name: string;
  store_code: string;
  store_type: StoreType;
  address: string;
  city: string;
  phone: string;
  manager_id: number;
  open_date: string;
  description?: string;
  merchant_id?: number;
}

// 修改参数
export interface StoreListModifyVO {
  store_id: number;
  store_name?: string;
  store_code?: string;
  store_type?: StoreType;
  address?: string;
  city?: string;
  phone?: string;
  manager_id?: number;
  open_date?: string;
  description?: string;
  merchant_id?: number;
}

// 删除参数
export interface StoreListRemoveVO {
  store_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface StoreListDetailModel {
  id: number;
  store_name: string;
  store_code: string;
  store_type: StoreType;
  status: StoreStatus;
  address: string;
  city: string;
  phone: string;
  manager_id: number;
  manager_name: string;
  open_date: string;
  description?: string;
  total_sales: number;
  total_orders: number;
  creator_name: string;
  create_time: string;
}
