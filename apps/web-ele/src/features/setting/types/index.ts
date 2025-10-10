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
export type IdString = `${number}`;

export type ColumnOptionCode = {
  column_option_code: string;
  i18nKey: string;
  id: IdString;
  name: string;
  prefix: string;
  storeInfo: any;
  suffix: string;
};
export type PrintTemplateApiType = {
  column_option_code?: ColumnOptionCode[];
  component_type?: string;
  id: IdString;
  imageUrl?: string;
  style: Record<string, string> /** 目前只用到textAlign  */ & {
    textAlign: string;
  };
};

// Setting Types
export * from './payment';
export * from './saleset';
export * from './storeset';
export * from './template';
