// 店铺创建状态枚举
export enum StoreCreateStatus {
  APPROVED = 'APPROVED', // 已通过
  COMPLETED = 'COMPLETED', // 已完成
  DRAFT = 'DRAFT', // 草稿
  REJECTED = 'REJECTED', // 已拒绝
  REVIEWING = 'REVIEWING', // 审核中
  SUBMITTED = 'SUBMITTED', // 已提交
}

// 店铺创建步骤枚举
export enum StoreCreateStep {
  BASIC_INFO = 'BASIC_INFO', // 基本信息
  COMPLETE = 'COMPLETE', // 完成
  EDITION = 'EDITION', // 版本选择
  PACKAGE = 'PACKAGE', // 套餐选择
  PAYMENT = 'PAYMENT', // 支付
}

// 查询参数
export interface StoreCreateQueryPageVO {
  page_num: number;
  page_size: number;
  keywords?: string;
  status?: StoreCreateStatus;
  step?: StoreCreateStep;
  start_date?: string;
  end_date?: string;
  merchant_id?: number;
}

// 分页响应
export interface StoreCreatePageModel {
  id: number;
  store_name: string;
  store_code: string;
  status: StoreCreateStatus;
  current_step: StoreCreateStep;
  progress: number;
  create_date: string;
  submit_date?: string;
  approve_date?: string;
  creator_name: string;
  create_time: string;
}

// 创建参数
export interface StoreCreateCreateVO {
  store_name: string;
  store_code: string;
  store_type: string;
  address: string;
  city: string;
  phone: string;
  manager_id: number;
  description?: string;
  merchant_id?: number;
}

// 修改参数
export interface StoreCreateModifyVO {
  create_id: number;
  store_name?: string;
  store_code?: string;
  store_type?: string;
  address?: string;
  city?: string;
  phone?: string;
  manager_id?: number;
  description?: string;
  merchant_id?: number;
}

// 删除参数
export interface StoreCreateRemoveVO {
  create_id_list: number[];
  merchant_id?: number;
}

// 详情模型
export interface StoreCreateDetailModel {
  id: number;
  store_name: string;
  store_code: string;
  store_type: string;
  status: StoreCreateStatus;
  current_step: StoreCreateStep;
  progress: number;
  address: string;
  city: string;
  phone: string;
  manager_id: number;
  manager_name: string;
  description?: string;
  create_date: string;
  submit_date?: string;
  approve_date?: string;
  creator_name: string;
  create_time: string;
}

// 店铺创建步骤模型
export interface StoreCreateStepModel {
  step: StoreCreateStep;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  disabled: boolean;
}

/** 商户套餐查询请求参数 */
export interface MerchantPackageListRequest {
  // 商户业务类型(RETAIL:零售,批发: WHOLESALE,餐饮:RESTAURANT,点货:COUNTING_GOODS)
  merchant_business_type?:
    | 'COUNTING_GOODS'
    | 'RESTAURANT'
    | 'RETAIL'
    | 'WHOLESALE';
  // 商户入网ID, 注：如果packageBusinessType类型为新购，此字段必填.
  merchant_enroll_id?: number;
  // 关联商户ID
  merchant_id?: number;
  // 套餐业务类型(NEW:新购,RENEW:续费复购,UPGRADE:套餐升级)
  package_business_type: 'NEW' | 'RENEW' | 'UPGRADE';
  // 当前要购买套餐的子商户ID
  sub_merchant_id: number;
}
/** * 商户套餐信息模型类包括所有套餐相关的数据 */
export interface MerchantPackageListResponse {
  // 商户当前应用的套餐费用信息(只显示最新的一条,付款完成的套餐),首次购买为空.
  // 商户和套餐费用设置模型
  cur_merchant_package?: MerchantPackageSettingModel;
  // 结算货币编码,如：CNY(关联)
  currency_code?: string;
  // 首次安装服务指导费
  first_install_cost_amount?: number;
  // 是否是首次安装
  is_first_install?: boolean;
  // 是否已开通免费试用版(1:开通过,0:未开通过),体验,如果已开通过，将不能在体验
  is_trialled?: boolean;
  // 商户套餐付款信息数据  商户套餐付款信息模型
  merchant_package_payment_info?: MerchantPackagePaymentInfoModel;
  // 当前业务类型支持套餐信息集合List 套餐信息模型类
  packages?: MerchantPackageInfoModel[];
  // 总盈余总额(目前商户根据购买时间换算的剩余多少钱)
  total_surplus_amount?: number;
}

export interface MerchantPackageSettingModel {
  // 套餐金额
  amount?: number;
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // 结算货币编码,如：CNY(关联)
  currency_code?: string;
  // 套餐天数
  day?: number;
  // 套餐折扣总金额
  discount_amount?: number;
  // 套餐折扣百分比
  discount_percentage?: number;
  // 首次安装服务指导费
  first_install_cost_amount?: number;
  // ID
  id?: number;
  // 是否为当前使用套餐，1:表示是,0:否
  is_current_package?: boolean;
  // 是否是首次安装
  is_first_install?: boolean;
  // 是否已开通免费试用版(1:开通过,0:未开通过),体验,如果已开通过，将不能在体验
  is_trialled?: boolean;
  // 套餐等级，套餐级别0,1,2如试用，普通，高级，VIP等等
  level?: number;
  // 商户业务类型(冗余字段)(RETAIL:零售,批发: WHOLESALE,餐饮:RESTAURANT,点货:COUNTING_GOODS)
  merchant_business_type?:
    | 'COUNTING_GOODS'
    | 'RESTAURANT'
    | 'RETAIL'
    | 'WHOLESALE';
  // 商户ID(关联)
  merchant_id?: number;
  // 商户自身订单ID关联
  merchant_order_id?: number;
  // 更新时间
  modify_time?: Date;
  // 套餐月金额，套餐换算后月金额
  month_amount?: number;
  // 套餐业务类型(NEW:新购,RENEW:续费复购,UPGRADE:套餐升级)
  package_business_type?: 'NEW' | 'RENEW' | 'UPGRADE';
  // 套餐过期时间
  package_expiration_time?: Date;
  // 套餐ID(关联)
  package_id?: number;
  // 套餐名称
  package_name?: string;
  // 套餐预付费模式  套餐预付费模式返回模型套餐包年包月收费的服务方式
  package_prepaid_mode?: MerchantPackagePrepaidModeModel;
  // 套餐预付费模式ID(关联)，用户选择的套餐预付费记录
  package_prepaid_mode_id?: number;
  // 套餐开始时间
  package_start_time?: Date;
  // 备注
  remark?: string;
  // 商户上的套餐使用状态(INIT:初始化,ACTIVE:有效,EXPIRED:已过期)
  status?: 'ACTIVE' | 'EXPIRED' | 'INIT' | 'INVALIDATED' | 'UPGRADED';
  // 支持的设置授权数量,不同的套餐不同的设备授权数
  support_authorized_limit?: number;
  // 支持的推销员人数,不同的套餐不同的人数
  support_salesman_limit?: number;
  // 支持的员工人数,不同的套餐不同的人数
  support_staff_limit?: number;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 时间戳
  version?: string;
}
export interface MerchantPackagePrepaidModeModel {
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // 结算货币编码,如：CNY(关联)
  currency_code?: string;
  // 套餐天数
  day?: number;
  // 套餐总折扣金额
  discount_amount?: number;
  // 套餐总折扣百分比,如：95折，为-5%
  discount_percentage?: number;
  // ID
  id?: number;
  // 更新时间
  modify_time?: Date;
  // 套餐月折扣后的金额，套餐换算后月金额
  month_amount?: number;
  // 套餐预付费模式名称(国际化)
  name?: string;
  // 套餐原始月金额(折扣前的原始月价格)，套餐换算后月金额
  origin_month_price?: number;
  // 套餐原始总金额
  origin_total_amount?: number;
  // 套餐id(关联)
  package_id?: number;
  // 备注
  remark?: string;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 套餐折扣后总金额
  total_amount?: number;
  // 时间戳
  version?: string;
}

export interface MerchantPackagePaymentInfoModel {
  // 平台支持的收款银行账户方式
  support_accept_banks?: PlatformAcceptBankModel[];
}

// 平台支持的收款银行账户方式模型
export interface PlatformAcceptBankModel {
  // 平台收款银行帐户信息
  accept_bank_accounts?: PlatformAcceptBankAccountModel[];
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // ID
  id?: number;
  // 更新时间
  modify_time?: Date;
  // 支持的平台收款支付账户方式(NO_PAYMENT:不需要支付,CASH:现金,PAYPAL:贝宝支付,OFFLINE_WECHAT:线下微信支付,OFFLINE_ALIPAY:线下支付宝支付,ONLINE_WECHAT:线上微信支付,ONLINE_ALIPAY:线上支付宝支付,ONLINE_BANKING:线上网银,OFFLINE_BANK_TRANSFER:线下银行转帐))
  payment_method?:
    | 'CASH'
    | 'INNER_TRANSFER'
    | 'NO_PAYMENT'
    | 'OFFLINE_ALIPAY_ORDINARY_QR_CODE'
    | 'OFFLINE_ALIPAY_PERSON_QR_CODE'
    | 'OFFLINE_BANK_TRANSFER'
    | 'OFFLINE_WECHAT_BUSINESS_QR_CODE'
    | 'OFFLINE_WECHAT_PERSON_QR_CODE'
    | 'ONLINE_ALIPAY_COMPUTER_WEBSITE'
    | 'ONLINE_BANKING'
    | 'ONLINE_WECHAT_JSAPI'
    | 'ONLINE_WECHAT_NATIVE'
    | 'PAYPAL';
  // 备注
  remark?: string;
  // 状态(OPEN:开通使用,CLOSE:未开通,关闭)
  status?: string;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 时间戳
  version?: string;
}
/** 平台收款银行帐户信息返回模型 */
export interface PlatformAcceptBankAccountModel {
  // 银行账户名称
  bank_account_name?: string;
  // 银行账户号,根据收款方式确定，支付宝则为支付收款帐号
  bank_account_number?: string;
  // 银行地址
  bank_address?: string;
  // 支行名称
  bank_branch_name?: string;
  // 银行编码
  bank_code?: string;
  // 银行名称(银行卡方式必填)
  bank_name?: string;
  // 银行Swift编码
  bank_swift_code?: string;
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // ID
  id?: number;
  // 更新时间
  modify_time?: Date;
  // 支持的平台收款支付账户方式(NO_PAYMENT:不需要支付,CASH:现金,PAYPAL:贝宝支付,OFFLINE_WECHAT:线下微信支付,OFFLINE_ALIPAY:线下支付宝支付,ONLINE_WECHAT:线上微信支付,ONLINE_ALIPAY:线上支付宝支付,ONLINE_BANKING:线上网银,OFFLINE_BANK_TRANSFER:线下银行转帐))
  payment_method?:
    | 'CASH'
    | 'INNER_TRANSFER'
    | 'NO_PAYMENT'
    | 'OFFLINE_ALIPAY_ORDINARY_QR_CODE'
    | 'OFFLINE_ALIPAY_PERSON_QR_CODE'
    | 'OFFLINE_BANK_TRANSFER'
    | 'OFFLINE_WECHAT_BUSINESS_QR_CODE'
    | 'OFFLINE_WECHAT_PERSON_QR_CODE'
    | 'ONLINE_ALIPAY_COMPUTER_WEBSITE'
    | 'ONLINE_BANKING'
    | 'ONLINE_WECHAT_JSAPI'
    | 'ONLINE_WECHAT_NATIVE'
    | 'PAYPAL';
  // 用户ID(关联)
  platform_payment_method_id?: number;
  // 备注
  remark?: string;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 时间戳
  version?: string;
}
export interface MerchantPackageInfoModel {
  // 套餐金额
  amount?: number;
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // 结算货币编码,如：CNY(关联)
  currency_code?: string;
  // ID
  id?: number;
  // 是否是当前业务类型和当前级别(level)的默认套餐1：是，0:否
  is_default?: boolean;
  // 套餐等级，套餐级别0,1,2如试用，普通，高级，VIP等等
  level?: number;
  // 商户业务类型(RETAIL:零售,批发: WHOLESALE,餐饮:RESTAURANT,点货:COUNTING_GOODS)
  merchant_business_type?:
    | 'COUNTING_GOODS'
    | 'RESTAURANT'
    | 'RETAIL'
    | 'WHOLESALE';
  // 更新时间
  modify_time?: Date;
  // 套餐名称
  name?: string;
  package_module_models?: MerchantPackageModuleModel[];
  // 套餐支持的预付费模式集合List
  package_prepaid_mode_models?: MerchantPackagePrepaidModeModel[];
  // 套餐图片(图片的URL)
  profile_photo?: string;
  // 产品描述说明
  remark?: string;
  // 套餐状态(INIT:初始化,ACTIVE:有效,CLOSE:关闭)
  status?: 'ACTIVE' | 'CLOSE' | 'INIT';
  // 支持的设置授权数量,不同的套餐不同的设备授权数
  support_authorized_limit?: number;
  // 支持的推销员人数,不同的套餐不同的人数
  support_salesman_limit?: number;
  // 支持的员工人数,不同的套餐不同的人数
  support_staff_limit?: number;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 时间戳
  version?: string;
}
/** *套餐功能模块基础信息返回模型 */
export interface MerchantPackageModuleModel {
  // 套餐功能模块金额
  amount?: AmountRes;
  // 创建时间
  create_time?: Date;
  // 创建者ID,user_id
  creator_id?: number;
  // 结算货币编码,如：CNY(关联)
  currency_code?: string;
  // 套餐功能模块天数
  day?: number;
  // 套餐功能模块对应的的功能id
  function_id?: number;
  // ID
  id?: number;
  // 商户ID关联
  merchant_id?: number;
  // 更新时间
  modify_time?: Date;
  // 套餐功能模块名称
  name?: string;
  // 功能模块图片(图片的URL)
  profile_photo?: string;
  // 功能模块描述说明
  remark?: string;
  // 时区当前数据的时区,zone_id
  time_zone?: string;
  // 时间戳
  version?: string;
}

export interface AmountRes {
  accuracy?: number;
  cent_int_value?: number;
  cent_long_value?: number;
  negative?: boolean;
  positive?: boolean;
  value?: number;
  zero?: boolean;
}
