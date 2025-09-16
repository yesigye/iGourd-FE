// 系统设置数据类型
export interface SystemSettings {
  id: number;
  site_name: string;
  site_logo: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  create_time: string;
  update_time: string;
}

// 用户设置数据类型
export interface UserSettings {
  id: number;
  user_id: number;
  theme: string;
  language: string;
  timezone: string;
  notifications: boolean;
  create_time: string;
  update_time: string;
}

// Setting Types
export * from './payment';
export * from './saleset';
export * from './storeset';
export * from './template';
