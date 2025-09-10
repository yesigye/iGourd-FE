export interface EmployeeInfo {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'FROZEN' | 'INIT';
  login_ids: Array<{
    country_area_code: string;
    login_account: string;
  }>;
  roles: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  create_time: string;
  last_login_time?: string;
  department?: string;
  position?: string;
}

export interface EmployeePageQueryParams {
  keyword?: string;
  page_num: number;
  page_size: number;
  merchant_id?: string;
  status?: string;
}

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
