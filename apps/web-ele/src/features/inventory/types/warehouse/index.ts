// 仓库行数据类型
export interface WarehouseRow {
  id: number;
  name: string;
  code: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  status: 'active' | 'inactive';
  create_time: string;
  update_time: string;
}

// 仓库表单数据类型
export interface WarehouseDTO {
  id?: number;
  name: string;
  code: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  status: 'active' | 'inactive';
}

// 仓库查询参数类型
export interface WarehouseQueryParams {
  keywords?: string;
  status?: string;
  page: number;
  page_size: number;
}
