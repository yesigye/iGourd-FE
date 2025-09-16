// 定制采购行数据类型
export interface CustomizedRow {
  id: number;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT';
  options: string;
  required: boolean;
  sort: number;
  create_time: string;
  update_time: string;
}

// 定制采购表单数据类型
export interface CustomizedDTO {
  id?: number;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT';
  options?: string;
  required: boolean;
  sort: number;
  selectionOptions?: { name: string }[];
}

// 定制采购查询参数类型
export interface CustomizedQueryParams {
  keywords?: string;
  type?: string;
  required?: boolean;
  page: number;
  page_size: number;
}
