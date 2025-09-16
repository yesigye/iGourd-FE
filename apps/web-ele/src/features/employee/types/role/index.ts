// 角色行数据类型
export interface RoleRow {
  id: number;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  create_time: string;
  update_time: string;
}

// 角色表单数据类型
export interface RoleDTO {
  id?: number;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  permissions?: number[];
}

// 角色查询参数类型
export interface RoleQueryParams {
  keywords?: string;
  status?: string;
  page: number;
  page_size: number;
}
