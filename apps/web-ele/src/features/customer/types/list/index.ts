// 客户信息分页查询请求参数
export interface CustomerInfoPageQueryParams {
  // 结束时间
  end_date?: Date;
  // 关键字
  keywords?: string;
  // 关联商户ID
  merchant_id?: number;
  // 标签名称
  name?: string;
  // 当前页码
  page_num?: number;
  // 每页条数
  page_size?: number;
  // 开始时间
  start_date?: Date;
}

// 客户信息分页查询返回模型
export interface CustomerInfo {
  // 账户名称集合
  account_name_list?: string[];
  // 地址
  address?: string;
  // 余额
  balance?: number;
  // 银行账户名称
  bank_account_name?: string;
  // 银行账号
  bank_account_number?: string;
  // 银行地址
  bank_address?: string;
  // 银行名称
  bank_name?: string;
  // 存款银行
  bank_of_deposit?: string;
  // 生日
  birthday?: Date;
  // 所属城市
  city_id?: number;
  // 客户编码
  code?: string;
  // 国家区号(如:+86),(冗余字段,方便查询)
  contact_country_area_code?: string;
  // 联系人姓名
  contact_name?: string;
  // 所属国家
  country?: string;
  // 国家ID
  country_id?: number;
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // 创建人
  creator_name?: string;
  // 结算货币编码
  currency_code?: string;
  // 客户标签对象集合
  customer_label_model_list?: CustomerLabelInfo[];
  // 欠款金额(冗余字段)
  debt_amount?: number;
  // 动态属性和数据
  dynamic_data?: string;
  // 电子邮箱
  email?: string;
  // GenderTypeEnum:性别类型枚举(MALE:男,FEMALE:女,UNKNOWN:未知)
  gender?: 'FEMALE' | 'MALE' | 'UNKNOWN';
  // ID
  id?: number;
  // 是否有会员权益(0:否,1:有)
  is_vip?: boolean;
  // 最后一次消费时间
  last_order_time?: Date;
  // 关联商户ID
  merchant_id?: number;
  // 更新时间
  modify_time?: Date;
  // 客户名称
  name?: string;
  // 手机号码
  phone_number?: string;
  // 积分
  points?: number;
  // 价格策略ID(关联)
  price_level_id?: number;
  // 价格策略名称
  price_level_name?: string;
  // 客户头像(图片的URL)
  profile_photo?: string;
  // 备注
  remark?: string;
  // 销售员ID(关联user_id)
  salesman_id?: number;
  // 销售员姓名
  salesman_name?: string;
  // 客户权益等级id(关联)
  setting_merchant_customer_rights_level_id?: number;
  // 所属州
  state?: string;
  // 增值税号码
  tax_number?: string;
  // 缴税比例
  tax_rate?: number;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 税务编号
  tin_number?: string;
  // 累积订单消费金额
  total_order_amount?: number;
  // 时间戳
  version?: string;
  // 会员开通时间
  vip_begin_time?: Date;
  // 会员编码
  vip_code?: string;
  // 优惠折扣百分比
  vip_discount_percentage?: Amount;
  // 会员充值赠送金额
  vip_gift_amount?: number;
  // vip等级
  vip_level?: number;
  // vip等级名称
  vip_level_name?: string;
  // 会员其他权益
  vip_other_rights?: string;
  // 积分倍数
  vip_points_multiple?: number;
  // 会员权益截止日期
  vip_rights_expiration_date?: Date;
  // SettingMerchantCustomerRightsTypeEnum:权益类型(CASH:充值赠现金,DISCOUNT:优惠折扣)
  vip_rights_type?: 'CASH' | 'DISCOUNT';
  // 邮政编码
  zip_code?: string;
}

// 客户标签信息返回模型
export interface CustomerLabelInfo {
  // 创建时间
  create_time?: Date;
  // 创建者ID
  creator_id?: number;
  // 创建者姓名
  creator_name?: string;
  // ID
  id?: number;
  // 关联商户ID
  merchant_id?: number;
  // 更新时间
  modify_time?: Date;
  // 客户标签名称
  name?: string;
  // 备注
  remark?: string;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 时间戳
  version?: string;
}

// 金额类型
export interface Amount {
  accuracy?: number;
  cent_int_value?: number;
  cent_long_value?: number;
  negative?: boolean;
  positive?: boolean;
  value?: number;
  zero?: boolean;
}

// 抽屉传输数据
export interface CustomerDrawerTransferData {
  type: 'add' | 'edit' | 'detail';
  id?: number;
}
