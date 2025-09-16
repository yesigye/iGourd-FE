// 商品分组相关类型定义

// 一级分组查询参数
export interface FirstGroupParams {
  page_num: number;
  page_size: number;
  merchant_id?: string;
  keywords?: string;
  parent_id?: string | null;
}

// 二级分组查询参数
export interface SecondGroupParams {
  page_num: number;
  page_size: number;
  merchant_id?: string;
  end_create_time?: string;
  major_name?: string;
  minor_name?: string;
  parent_id?: string | null;
  remark?: string;
  start_create_time?: string;
  keywords?: string;
}

// 一级分组项
export interface FirstGroupItem {
  id: string;
  major_name: string;
  merchant_id?: string;
  parent_id?: string | null;
  create_time?: string;
  creator_name?: string;
}

// 二级分组项
export interface SecondGroupItem {
  id: string;
  major_name: string;
  parent_group_name: string;
  product_number: number;
  creator_name: string;
  create_time: string;
  parent_id: string;
  merchant_id?: string;
}

// 分组列表响应
export interface GroupListResponse {
  list: (FirstGroupItem | SecondGroupItem)[];
  total: number;
  page_num: number;
  page_size: number;
}

// 删除分组参数
export interface DeleteGroupParams {
  merchant_id: string;
  product_group_ids: string[];
}
