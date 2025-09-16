// 员工行数据类型
export interface EmployeeRow {
  id: number;
  name: string;
  code: string;
  phone: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  create_time: string;
  update_time: string;
}

// 员工表单数据类型
export interface EmployeeDTO {
  id?: number;
  name: string;
  code: string;
  phone: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
}

// 员工查询参数类型
export interface EmployeeQueryParams {
  keywords?: string;
  department?: string;
  status?: string;
  page: number;
  page_size: number;
}
