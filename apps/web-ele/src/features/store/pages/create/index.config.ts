export const ContentEnum = {
  CREATE_MERCHANT: 1, // 创建商户,
  SELECT_PACKAGE: 2, // 选择套餐,
  PAYMENT: 3, //付款,
  COMPLETE: 4, //完成
  PLACE_ORDER: 3
};

// 入网状态
export const EnrollStatus = {
  INIT: -1,
  PENDING: 2, // 等待中,
  APPROVED: 0, // 审核通过,
  REJECTED: 1 // 审核拒绝
};
