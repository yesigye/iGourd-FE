// 商品行数据类型
export interface ProductRow {
  id: number;
  name: string;
  code: string;
  category: string;
  brand: string;
  unit: string;
  price: number;
  cost: number;
  status: 'active' | 'inactive';
  create_time: string;
  update_time: string;
}

// 商品表单数据类型
export interface ProductDTO {
  id?: number;
  name: string;
  code: string;
  category: string;
  brand: string;
  unit: string;
  price: number;
  cost: number;
  status: 'active' | 'inactive';
}

// 商品查询参数类型
export interface ProductQueryParams {
  keywords?: string;
  category?: string;
  brand?: string;
  status?: string;
  page: number;
  page_size: number;
}
