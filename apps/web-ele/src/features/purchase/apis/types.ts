// 商品单位分页返回模型
export interface ProductUnitModel {
  // 创建时间
  create_time?: Date
  // 创建者ID,user_id
  creator_id?: number
  // 创建人姓名
  creator_name?: string
  // 小数位数(1~4)
  decimal_places?: number
  // ID
  id?: number
  // 最后一次修改人id
  last_modify_id?: number
  // 最后一次修改人姓名
  last_modify_name?: string
  // 商户ID(关联)
  merchant_id?: number
  // 更新时间
  modify_time?: Date
  // 单位名称,如:PCS
  name?: string
  // 备注
  remark?: string
  // ProductUnitSourceTypeEnum:商品单位来源类型(SYSTEM:系统默认,CUSTOM:用户自定义)
  source_type?: 'CUSTOM' | 'SYSTEM'
  // 税务局单位id(暂时不用)
  taxation_office_unit_id?: number
  // 时区当前数据的时区,zone_id
  time_zone?: string
  // 时间戳
  version?: string
}
// 商户分类分页查询请求参数VO
export interface ProductUnitQueryParams {
  // 截止创建时间
  end_create_time?: Date
  // 全局搜索关键词搜索。
  keywords?: string
  // 商品分类名称(主语言)
  major_name?: string
  // 关联商户ID
  merchant_id?: number
  // 商品分类名称辅语言)
  minor_name?: string
  // 当前页码
  page_num?: number
  // 每页条数
  page_size?: number
  // 父类商品组主键ID
  parent_id?: number
  // 备注
  remark?: string
  // 开始创建时间
  start_create_time?: Date
}
/**商品基础信息分页页面查询数据返回模型 */
export interface ProductProfileModel {
  // 创建时间
  create_time?: Date
  // 创建者ID,user_id
  creator_id?: number
  // 创建人名称
  creator_name?: string
  // ID
  id?: number
  // 商品分类名称(主语言)
  major_name?: string
  // 关联商户ID
  merchant_id?: number
  // 商品分类名称辅语言)
  minor_name?: string
  // 更新时间
  modify_time?: Date
  // 父类商品组名称
  parent_group_name?: string
  // 父商户分类ID(一级商户分类该字段为空)
  parent_id?: number
  // 该商品组的商品数量
  product_number?: number
  // 备注
  remark?: string
  // 时区当前数据的时区,zone_id
  time_zone?: string
  // 时间戳
  version?: string
}

/**商户分类分页查询请求参数VO */
export interface ProductProfileQueryParams {
  // 截止创建时间
  end_create_time?: Date
  // 全局搜索关键词搜索。
  keywords?: string
  // 商品分类名称(主语言)
  major_name?: string
  // 关联商户ID
  merchant_id?: number
  // 商品分类名称辅语言)
  minor_name?: string
  // 当前页码
  page_num?: number
  // 每页条数
  page_size?: number
  // 父类商品组主键ID
  parent_id?: number
  // 备注
  remark?: string
  // 开始创建时间
  start_create_time?: Date
}

/** /** ProductInfoStatusEnum:商品状态(INIT:初始化,ON_SALE:销售中(上架),OFF_SALE:下架) */
export enum ProductInfoStatusEnum {
  /** 初始化 */
  INIT = 'INIT',
  /** 下架 */
  OFF_SALE = 'OFF_SALE',
  /** 上架 */
  ON_SALE = 'ON_SALE',
}

/** 商品信息列表查询参数VO */
export interface ProductInfoQueryParams {
  /** 关键字,商品名/编码 */
  keywords?: string
  /** 商品名称(主语言) */
  major_name?: string
  /** 关联商户ID */
  merchant_id?: number
  /** 当前页码 */
  page_num?: number
  /** 每页条数 */
  page_size?: number
  /** 商品条码(新，用户可编辑) */
  sku_barcode?: string
  /** 商品编码(新不唯一) */
  spec_code?: string
  /** ProductInfoStatusEnum:商品状态(INIT:初始化,ON_SALE:销售中(上架),OFF_SALE:下架) */
  status?: 'INIT' | 'OFF_SALE' | 'ON_SALE'
}
/** 商品信息分页页面查询数据返回模型 */
export interface ProductInfoModel {
  /** 商品条码 */
  barcode?: string
  /** 关联商品基础资料ID */
  basic_product_id?: number
  /** 关联商品基础单位ID */
  basic_unit_id?: number
  /** 基础单位名称 */
  basic_unit_name?: string
  /** 和基础单位换算比例 */
  basic_unit_radio?: number
  /** 商品编码 */
  code?: string
  /** 成本价格 */
  cost_price?: number
  /** 创建时间 */
  create_time?: Date
  /** 创建者ID,user_id */
  creator_id?: number
  /** 创建人名称 */
  creator_name?: string
  /** 结算货币编码(关联) */
  currency_code?: string
  /** 动态属性和数据 */
  dynamic_data?: string
  /** 消费税额 */
  excise_tax?: TaxInfoModel
  /** 消费税的名称 */
  excise_tax_name?: string
  /** 商品到期提醒天数 */
  expiration_reminder_days?: number
  /** 毛重量 */
  gross_weight?: number
  /** ID */
  id?: number
  /** 初始库存数量冗余字段 */
  initial_stock_quantity?: number
  /** 初始库存仓库ID(关联) */
  initial_stock_warehouse_id?: number
  /** 初始库存仓位ID(关联) */
  initial_stock_warehouse_location_id?: number
  /** 初始化库存名称 */
  initial_stock_warehouse_name?: string
  /** 是否基础单位商品 */
  is_basic?: boolean
  /** 商品描述(主语言) */
  major_description?: string
  /** 商品名称(主语言) */
  major_name?: string
  /** 生产商名称 */
  manufacturer_name?: string
  /** 生产商产地 */
  manufacturer_origin?: string
  /** 商户ID关联 */
  merchant_id?: number
  /** 商品描述(辅语言) */
  minor_description?: string
  /** 商品名称(辅语言) */
  minor_name?: string
  /** 更新时间 */
  modify_time?: Date
  /** 月销售量 */
  monthly_sales_quantity?: number
  /** 净重量 */
  net_weight?: number
  /** 其他税额 */
  other_tax?: TaxInfoModel
  /** 其他税的名称 */
  other_tax_name?: string
  /** 商品条码 */
  product_barcode?: string
  /** 商品编码 */
  product_code?: string
  /** 商品分类ID关联 */
  product_group_id?: number
  /** 商户分类名称 */
  product_group_name?: string
  /** 商品标签列表 */
  product_label_list?: ProductLabelModel[]
  /** 关联商品基础资料ID */
  product_profile_id?: number
  /** 规格kv信息关联 */
  product_spec_kv?: string
  /** 商品单位主键ID(关联) */
  product_unit_id?: number
  /** 商品单位名称 */
  product_unit_name?: string
  /** 商品生产日期 */
  production_date?: Date
  /** 商品资料图片 */
  profile_photo?: string
  /** 备注 */
  remark?: string
  /** 销售仓库Id */
  sale_warehouse_id?: number
  /** 销售仓库名称 */
  sale_warehouse_name?: string
  /** 销售仓商品库存数量 */
  sale_warehouse_product_stock_quantity?: number
  /** 销售进度百分比 */
  sales_progress_percentage?: number
  /** 售价 */
  selling_price?: number
  /** 商品保质至XX日期 */
  shelf_life?: Date
  /** 商品条码(新，用户可编辑) */
  sku_barcode?: string
  /** 规格 */
  spec?: string
  /** ProductInfoStatusEnum:商品状态(INIT:初始化,ON_SALE:销售中(上架),OFF_SALE:下架) */
  status?: 'INIT' | 'OFF_SALE' | 'ON_SALE'
  /** 库存总数量 */
  stock_total_quantity?: number
  /** 调拨单号No */
  stock_transfer_no?: string
  /** 库存预警值 */
  stock_warning_quantity?: number
  /** 消费税主键ID(关联) */
  tax_excise_id?: number
  /** 增值税的名称 */
  tax_name?: string
  /** 其他税主键ID(关联) */
  tax_other_id?: number
  /** 缴税比例 */
  tax_rate?: number
  /** 增值税主键ID(关联) */
  tax_vat_id?: number
  /** 时区当前数据的时区,zone_id */
  time_zone?: string
  /** 增值税额 */
  vat_tax?: TaxInfoModel
  /** 供应商ID */
  vendor_id?: number
  /** 供应商姓名 */
  vendor_name?: string
  /** 时间戳 */
  version?: string
}
/** 税务基本信息返回模型 */
export interface TaxInfoModel {
  /** TaxCalculationTypeEnum:计税类型枚举(PERCENTAGE:百分比,FIXED_PER_UNIT:每单位固定费用) */
  calculation_type?: 'FIXED_PER_UNIT' | 'PERCENTAGE'
  /** 创建时间 */
  create_time?: Date
  /** 创建者ID,user_id */
  creator_id?: number
  /** 货币单位 */
  currency_code?: string
  /** ID */
  id?: number
  /** 商户ID(关联) */
  merchant_id?: number
  /** 更新时间 */
  modify_time?: Date
  /** 税名 */
  name?: string
  /** 百分比 */
  percentage?: number
  /** 备注 */
  remark?: string
  /** 税额 */
  tax_amount?: number
  /** TaxTypeEnum:税类型枚举(VAT:增值税,OTHER_TAX:其他税) */
  tax_type?: 'OTHER_TAX' | 'VAT'
  /** TaxationOfficeTaxTypeEnum:增值税税率类型枚举(STANDARD:标准税率,EXEMPT:免税,ZERO:零税率) */
  taxation_office_tax_type?: 'EXEMPT' | 'STANDARD' | 'ZERO'
  /** 时区当前数据的时区,zone_id */
  time_zone?: string
  /** 时间戳 */
  version?: string
}

export interface ProductLabelModel {
  /** 创建时间 */
  create_time?: Date
  /** 创建者ID,user_id */
  creator_id?: number
  /** ID */
  id?: number
  /** 商户ID关联 */
  merchant_id?: number
  /** 更新时间 */
  modify_time?: Date
  /** 商品标签名称 */
  name?: string
  /** 备注 */
  remark?: string
  /** 时区当前数据的时区,zone_id */
  time_zone?: string
  /** 时间戳 */
  version?: string
}
