// 库存价格变更相关类型定义

// 价格类型枚举
export enum PriceType {
  COST_PRICE = 'COST_PRICE',
  SELLING_PRICE = 'SELLING_PRICE'
}

// 价格变更日志查询参数
export interface PriceChangeLogParams {
  page_num: number;
  page_size: number;
  merchant_id?: string;
  price_type?: PriceType;
  keywords?: string;
  product_code?: string;
  product_name?: string;
  start_time?: string;
  end_time?: string;
}

// 价格变更日志项
export interface PriceChangeLogItem {
  id: string;
  price_type: PriceType;
  product_name: string;
  product_code: string;
  origin_price: number;
  final_price: number;
  change_amount: number;
  remark?: string;
  creator_name: string;
  create_time: string;
  merchant_id?: string;
}

// 价格变更日志列表响应
export interface PriceChangeLogListResponse {
  list: PriceChangeLogItem[];
  total: number;
  page_num: number;
  page_size: number;
}

// 价格类型选项
export interface PriceTypeOption {
  id: number;
  label: string;
  value: PriceType;
}
