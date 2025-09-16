// 设备状态枚举
export enum DeviceStatus {
  ONLINE = 'ONLINE', // 在线
  OFFLINE = 'OFFLINE', // 离线
  MAINTENANCE = 'MAINTENANCE', // 维护中
  ERROR = 'ERROR', // 故障
}

// 设备类型枚举
export enum DeviceType {
  POS = 'POS', // 收银机
  PRINTER = 'PRINTER', // 打印机
  SCANNER = 'SCANNER', // 扫描枪
  DISPLAY = 'DISPLAY', // 显示屏
  CAMERA = 'CAMERA', // 摄像头
  OTHER = 'OTHER', // 其他
}

// 查询参数
export interface StoreDeviceQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: DeviceStatus;
  device_type?: DeviceType;
  store_id?: number;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface StoreDevicePageModel {
  id: number;
  device_name: string;
  device_code: string;
  device_type: DeviceType;
  status: DeviceStatus;
  store_name: string;
  ip_address: string;
  mac_address: string;
  last_online_time: string;
  version: string;
  location: string;
  remark?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface StoreDeviceCreateVO {
  device_name: string;
  device_code: string;
  device_type: DeviceType;
  store_id: number;
  ip_address: string;
  mac_address: string;
  version: string;
  location: string;
  remark?: string;
  merchant_id?: number;
}

// 修改参数
export interface StoreDeviceModifyVO {
  device_id: number;
  device_name?: string;
  device_code?: string;
  device_type?: DeviceType;
  store_id?: number;
  ip_address?: string;
  mac_address?: string;
  version?: string;
  location?: string;
  remark?: string;
  merchant_id?: number;
}

// 删除参数
export interface StoreDeviceRemoveVO {
  device_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface StoreDeviceDetailModel {
  id: number;
  device_name: string;
  device_code: string;
  device_type: DeviceType;
  status: DeviceStatus;
  store_id: number;
  store_name: string;
  ip_address: string;
  mac_address: string;
  last_online_time: string;
  version: string;
  location: string;
  remark?: string;
  creator_name: string;
  create_time: string;
}
