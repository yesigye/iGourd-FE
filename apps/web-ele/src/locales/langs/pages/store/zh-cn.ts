// 门店列表
export default {
  storeForm: {
    business_type: {
      label: '业务类型',
      placeholder: '选择业务类型',
    },
    full_name: {
      label: '门店名称',
      placeholder: '输入门店名称',
    },
    short_name: {
      label: '门店简称',
      placeholder: '输入门店简称',
    },
    industry_code: {
      label: '门店行业',
      placeholder: '选择门店行业',
    },
    time_zone_id: {
      label: '时区',
      placeholder: '选择时区',
    },
    country_id: {
      label: '国家',
      placeholder: '选择国家',
    },
    actual_address: {
      label: '地址',
      placeholder: '输入地址',
    },
    basic_currency_code: {
      label: '基础货币',
      placeholder: '选择基础货币',
    },
    majorCountry_language: {
      label: '语言设置',
      placeholder: '选择主语言',
    },
    minorCountry_language: {
      label: '语言设置',
      placeholder: '选择副语言',
    },
    merchantExisted: '门店名称已存在',
  },
  standardCard: {
    monthAmountUnit: '月',
    moduleTitle: '功能模块',
    employeeTitle: '员工上限',
  },

  storeEdition: {},
  storePackage: {
    purchaseBtn: '购买',

    monthAmountUnit: '月',
    payableTitle: '应付金额',
    methodTitle: '请选择付款方式',
    methodOffline: '离线支付',
    placeButton: '下单',

    payableAmount: '金额',
    payableDiscount: '折扣',
    payableFee: '初始服务指导费',
    payableOrigin: '原套餐抵扣金额',
    total: '总计',

    payment_method_CASH: '现金支付',
    payment_method_OFFLINE_BANK_TRANSFER: '线下银行转帐',
  },

  storePayment: {
    payAmount: '应付金额',
    accpetBank: '账户银行',
    accpetBankSub: '请汇款指定金额，否则购买将失败',
    accpetAccmout: '帐户',
    copyAccount: '复制帐户',
    swiftCode: '银行代码',
    recipient: '收件人公司名称',
    paidAlready: '已经支付',
    copySuccess: '复制成功',

    frameMessage: '您已选择离线支付，如果支付已完成，请单击“已支付”',
  },

  storeComplete: {
    creationTitleAPPROVED: '完成验证',
    creationTitleREJECTED: '创建失败',
    creationTitlePENDING: '正在验证的交易',

    creationMessageAPPROVED:
      '您的帐户验证已完成。现在，您可以登录并开始使用我们的服务。',
    creationMessageREJECTED:
      '您的帐户验证未通过。请离线联系销售人员调查原因！重新创建店面。',
    creationMessagePENDING:
      '您的交易目前正在验证中，请耐心等待。我们将在一个工作日内完成验证，请注意您的电子邮件或短信。验证成功后，您可以登录并访问主页。',

    auditText: '审核记录',

    // creationBtnTextAPPROVED: '转到登录',
    creationBtnTextAPPROVED: '返回',
    creationBtnTextREJECTED: '返回',
    creationBtnTextPENDING: '返回',

    emptyText: '暂无数据',
  },

  storeList: {
    title: '门店列表',
    updateSuccess: '修改成功',
    search: '搜索',
    add: '添加',
    fieldsBtn: '列表',
    storecode: '门店编号',
    storeabbreviation: '门店简称',
    storename: '门店名称',
    businesstype: '业务类型',
    storeindustry: '门店行业',
    state: '状态',
    creationtime: '创建时间',
    address: '地址',
    timezone: '时区',
    country: '国家',
    basicCurrency: '基础货币',

    // 门店列表字段
    searchInput: '输入要搜索的关键字（门店缩写、门店名称）',

    id: '门店编码',
    short_name: '门店简称',
    full_name: '门店全称',
    business_type: '业务类型',

    industry_name: '门店行业',
    status: '状态',
    upgradeService: '升级服务',
    create_time: '创建时间',

    final_expiration_time: '套餐有效期',
    owned_quantity: '设备数量',
    used_quantity: '设备使用数量',
    package: '套餐',
    device: '设备授权',
    action: '编辑',

    renew: '续订',
    upgrade: '升级',
    authorize: '授权',

    auditRecord: '审核记录',
    editTitle: '编辑',
    submitBtnText: '保存',

    // 状态翻译
    status_NONACTIVATED: '未开通',
    status_OPEN: '开通',
    status_FROZE: '冻结',
    status_CLOSED: '已关闭',
    status_EXPIRED: '已过期',

    qty_chang_title: '数量变更记录',
    source_BUY: '直接购买{count}台设备授权',
    source_BUY_DEVICE: '购买套餐赠送{count}台设备数量。',
    source_BUY_PACKAGE: '购买设备赠送{count}台设备数量',
  },
  storePaymentList: {
    title: '订单记录',
    // 列表字段
    merchant_order_no: '订单编号',
    storename: '门店名称',
    package_name: '服务名称',
    total_day: '天数',
    discount_amount: '折扣',
    total_amount: '金额',
    payment_method: '付款方式',
    type: '付款类型',
    status: '审核',
    create_time: '创建时间',

    // 状态翻译-支付方式
    payment_method_NO_PAYMENT: '不需要支付',
    payment_method_CASH: '现金',
    payment_method_OFFLINE_WECHAT: '线下微信支付',
    payment_method_OFFLINE_ALIPAY: '线下支付宝支付',
    payment_method_ONLINE_WECHAT: '线上微信支付',
    payment_method_ONLINE_ALIPAY: '线上支付宝支付',
    payment_method_ONLINE_BANKING: '线上网银',
    payment_method_OFFLINE_BANK_TRANSFER: '线下银行转帐',

    // 状态翻译-订单类型
    type_INNER_TRADE: '内部交易',
    type_MERCHANT_PACKAGE_BUY: '商户套餐购买',
    type_MERCHANT_GOODS_BUY: '商户商品购买',
    type_OTHER: '其他',

    // 状态翻译-订单状态
    status_INIT: '待支付',
    status_SUCCESS: '支付成功',
    status_CANCEL: '已取消',
    status_REFUND: '已退款',
    status_REFUNDING: '退款中',
    status_REFUNDFAIL: '退款失败',
    // 入网状态
    enroll_status_PENDING: '等待中',
    enroll_status_APPROVED: '审核通过',
    enroll_status_REJECTED: '审核拒绝',
  },

  storeDevice: {
    title: '设备授权',
    searchPlaceholder: '输入要搜索的关键字（设备名称、设备代码）',
    // 列表字段
    storename: '门店全称',
    short_name: '门店简称',
    code: '设备ID',
    name: '设备名称',
    mac_address: 'Mac地址',
    ip_address: '登录IP',
    last_login_time: '登录时间',
    login_count: '登录次数',
    software_version: '版本号',
    version_update_time: '版本更新时间',
    os_version: '设备操作系统版本',
    type: '设备类型',
    is_authorized: '授权',
    status: '是否禁用',

    // 状态翻译
    // 状态翻译
    status_ACTIVE: '激活',
    status_FROZEN: '冻结',
    status_PROHIBITED: '禁用',

    type_POS: 'POS设备',
    type_HANDHELD_TERMINAL: '手持设备',
    type_PRICE_INCREASER: '提价器',
    type_SCAN_PRINT_ALL_IN_ONE: '扫打一体机',
  },
  storeIndustry: {
    Catering: '餐饮',
    Bakery: '烘焙',
    Retail: '零售',
    'Apparel and Footwear': '服装与鞋类',
    'Fresh Food': '生鲜食品',
    'Maternity and Infant': '母婴',
    Beauty: '美容',
    'Arts Training': '艺术培训',
    Pet: '宠物',
    'Life Services': '生活服务',
    'Wholesale and Trade': '批发与贸易',
    Other: '其他',
  },
}
