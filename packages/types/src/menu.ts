/**
 * 菜单相关类型定义
 */

// 功能权限树结构
export interface FunctionTree {
  id: number;
  name: string;
  key: string;
  children?: FunctionTree[];
}

// 菜单信息
export interface MenuInfo {
  id: number;
  name: string;
  key: string;
  type: 'DIRECTORY' | 'PAGE';
  status: 'ACTIVE' | 'FROZEN';
  path?: string;
  component?: string;
  icon?: string;
  order?: number;
  children?: MenuInfo[];
}

// 菜单查询条件
export interface MenuQueryParams {
  app_key: string;
  menu_key?: string;
  menu_names?: string;
  menu_type?: 'DIRECTORY' | 'PAGE';
  menu_status?: 'ACTIVE' | 'FROZEN';
}

// 菜单树列表响应
export interface MenuTreeListResponse {
  data: MenuInfo[];
  code: number;
  message: string;
}
