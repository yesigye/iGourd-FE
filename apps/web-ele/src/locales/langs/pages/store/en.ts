// 门店列表
export default {
  storeForm: {
    business_type: {
      label: 'Business Type',
      placeholder: 'Enter Business Type'
    },
    full_name: {
      label: 'Store Name',
      placeholder: 'Enter Store Name'
    },
    short_name: {
      label: 'Store Short Name',
      placeholder: 'Enter Store Short Name'
    },
    industry_code: {
      label: 'Store Industry',
      placeholder: 'Enter Store Industry'
    },
    time_zone_id: {
      label: 'Time Zone',
      placeholder: 'Enter Time Zone'
    },
    country_id: {
      label: 'Country',
      placeholder: 'Enter Country'
    },
    actual_address: {
      label: 'Address',
      placeholder: 'Enter Address'
    },
    basic_currency_code: {
      label: 'Basic Currency',
      placeholder: 'Enter Basic Currency'
    },
    majorCountry_language: {
      label: 'Language Settings',
      placeholder: 'Enter Main Language'
    },
    minorCountry_language: {
      label: 'Language Settings',
      placeholder: 'Enter Secondary Language'
    },

    merchantExisted: 'merchant name existed'
  },
  standardCard: {
    monthAmountUnit: 'month',
    moduleTitle: 'Function Module',
    employeeTitle: 'Employee Cap'
  },

  storeEdition: {},
  storePackage: {
    purchaseBtn: 'Purchase',

    monthAmountUnit: 'month',
    payableTitle: 'Payable Amount',
    methodTitle: 'Please Select A Payment Method',
    methodOffline: 'Offline Payment',
    placeButton: 'Place Order',

    payableAmount: 'Amount',
    payableDiscount: 'Discount',
    payableFee: 'Initial Service Guidance Fee',
    payableOrigin: 'Deducted amount of original package',
    total: 'Total',

    payment_method_CASH: 'Cash payment',
    payment_method_OFFLINE_BANK_TRANSFER: 'Offline bank transfer'
  },

  storePayment: {
    payAmount: 'Payable Amount',
    accpetBank: 'Accpet Bank',
    accpetBankSub: 'Please remit the specified amount of money, otherwise the purchase will fail',
    accpetAccmout: 'Accpet Account',
    copyAccount: 'copy account',
    swiftCode: 'SwiftCode',
    recipient: 'Name of recipient company',
    paidAlready: 'Paid Already',
    copySuccess: 'Copy Success',

    frameMessage: 'You have selected offline payment, if the payment has been completed, please click Paid'
  },

  storeComplete: {
    creationTitleAPPROVED: 'Creation failed',
    creationTitleREJECTED: 'Creation failed',
    creationTitlePENDING: 'Transaction Under Verification',

    creationMessageAPPROVED: 'Your account verification is complete. Now, you can log in and start using our services.',
    creationMessageREJECTED:
      'Your account verification did not pass. Please contact the sales personnel offline to investigate the reason!Recreate storefront.',
    creationMessagePENDING:
      'Your transaction is currently under verification, please wait patiently. We will complete the verification within one business day, please pay attention to your email or text messages. After successful verification, you can log in and access the homepage.',

    auditText: 'Audit Records',

    // creationBtnTextAPPROVED: 'Go To Login',
    creationBtnTextAPPROVED: 'Back',
    creationBtnTextREJECTED: 'Back',
    creationBtnTextPENDING: 'Back',

    emptyText: 'No Data'
  },

  storeList: {
    title: 'Store List',
    updateSuccess: 'Modified successfully',
    search: 'Search',
    add: 'Add',
    fieldsBtn: 'Fields',
    storecode: 'Store Code',
    storeabbreviation: 'Store abbreviation',
    storename: 'Store Name',
    businessType: 'Business Type',
    storeindustry: 'Store Industry',
    state: 'State',
    creationtime: 'Creation time',
    address: 'Address',
    timezone: 'Time Zone',
    country: 'Country',
    basicCurrency: 'Basic Currency',

    // 门店列表字段
    searchInput: 'Enter keywords (Store Abbreviation，Store Name)',

    id: 'Store ID',
    short_name: 'Store Short Name',
    full_name: 'Store Name',
    business_type: 'Business Type',

    industry_name: 'Store Industry',
    status: 'Status',
    upgradeService: 'Upgrade Service',
    create_time: 'Creation Time',

    final_expiration_time: 'Package validity',
    owned_quantity: 'Device Qty',
    used_quantity: 'Device used Qty',

    package: 'Package',
    device: 'Device authorization',
    action: 'Action',

    renew: 'Renew',
    upgrade: 'Upgrade',
    authorize: 'Authorize',

    auditRecord: 'Audit record',
    editTitle: 'Edit',
    submitBtnText: 'Save',

    // 状态翻译
    status_NONACTIVATED: 'NONACTIVATED',
    status_OPEN: 'OPEN',
    status_FROZE: 'FROZE',
    status_CLOSED: 'CLOSED',
    status_EXPIRED: 'EXPIRED',

    qty_chang_title: 'Qty Change record',
    source_BUY: 'Purchase Qty of {count} devices',
    source_BUY_DEVICE: 'Purchase device complimentary {count} device quantities',
    source_BUY_PACKAGE: 'Purchase Package complimentary {count} device quantities'
  },

  storePaymentList: {
    title: 'Order Record',
    // 列表字段
    merchant_order_no: 'Order ID',
    storename: 'Store Name',
    package_name: 'Service Name',
    total_day: 'Number Of Days',
    discount_amount: 'Discount',
    total_amount: 'Amount',
    payment_method: 'Type Of Payment',
    type: 'Mode of payment',
    status: 'Status',
    create_time: 'Creation Time',

    // 状��翻译-支付方式
    payment_method_NO_PAYMENT: 'NO_PAYMENT',
    payment_method_CASH: 'CASH',
    payment_method_OFFLINE_WECHAT: 'OFFLINE_WECHAT',
    payment_method_OFFLINE_ALIPAY: 'OFFLINE_ALIPAY',
    payment_method_ONLINE_WECHAT: 'ONLINE_WECHAT',
    payment_method_ONLINE_ALIPAY: 'ONLINE_ALIPAY',
    payment_method_ONLINE_BANKING: 'ONLINE_BANKING',
    payment_method_OFFLINE_BANK_TRANSFER: 'OFFLINE_BANK_TRANSFER',

    // 状态翻译-订单类型
    type_INNER_TRADE: 'INNER_TRADE',
    type_MERCHANT_PACKAGE_BUY: 'MERCHANT_PACKAGE_BUY',
    type_MERCHANT_GOODS_BUY: 'MERCHANT_GOODS_BUY',
    type_OTHER: 'OTHER',

    // 状态翻译-订单状态
    status_INIT: 'INIT',
    status_SUCCESS: 'SUCCESS',
    status_CANCEL: 'CANCEL',
    status_REFUND: 'REFUND',
    status_REFUNDING: 'REFUNDING',
    status_REFUNDFAIL: 'REFUNDFAIL',

    // 入网状态
    enroll_status_PENDING: 'Pending',
    enroll_status_APPROVED: 'Approved',
    enroll_status_REJECTED: 'Rejected'
  },

  storeDevice: {
    title: 'Device authorization',
    searchPlaceholder: 'Enter keywords (Device Name，Device Code)',
    // 列表字段
    storename: 'Store Name',
    short_name: 'Store Short Name',
    code: 'Device Code',
    name: 'Device Name',
    mac_address: 'Mac Address',
    ip_address: 'Login IP',
    last_login_time: 'Login times',
    login_count: 'Login Count',
    software_version: 'Version Number',
    version_update_time: 'Version Update Time',
    os_version: 'Device Operating System Version',
    type: 'Device Type',
    is_authorized: 'Authorzation',
    status: 'Disabled',
    // 状态翻译
    status_ACTIVE: 'ACTIVE',
    status_FROZEN: 'FROZEN',
    status_PROHIBITED: 'PROHIBITED',

    type_POS: 'POS',
    type_HANDHELD_TERMINAL: 'HANDHELD_TERMINAL',
    type_PRICE_INCREASER: 'PRICE_INCREASER',
    type_SCAN_PRINT_ALL_IN_ONE: 'SCAN_PRINT_ALL_IN_ONE'
  },
  storeIndustry: {
    //动态内容
    Catering: 'Catering',
    Bakery: 'Bakery',
    Retail: 'Retail',
    'Apparel and Footwear': 'Apparel and Footwear',
    'Fresh Food': 'Fresh Food',
    'Maternity and Infant': 'Maternity and Infant',
    Beauty: 'Beauty',
    'Arts Training': 'Arts Training',
    Pet: 'Pet',
    'Life Services': 'Life Services',
    'Wholesale and Trade': 'Wholesale and Trade',
    Other: 'Other'
  }
};
