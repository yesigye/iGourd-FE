import type {
  SettingPaymentQueryPageVO,
  SettingPaymentPageModel,
  SettingPaymentCreateVO,
  SettingPaymentModifyVO,
  SettingPaymentRemoveVO,
  SettingPaymentDetailModel,
} from '@@/setting/types';

import { requestClient } from '#/api/request';

const SETTING_PAYMENT_BASE_URL = '/v1/merchant/setting/payment';

// 获取支付设置分页列表
export function getSettingPaymentPageListApi(data: SettingPaymentQueryPageVO) {
  return requestClient.post(
    `${SETTING_PAYMENT_BASE_URL}/page-list`,
    data,
  );
}

// 创建支付设置
export function createSettingPaymentApi(data: SettingPaymentCreateVO) {
  return requestClient.post(
    `${SETTING_PAYMENT_BASE_URL}/create`,
    data,
  );
}

// 更新支付设置
export function updateSettingPaymentApi(data: SettingPaymentModifyVO) {
  return requestClient.post(
    `${SETTING_PAYMENT_BASE_URL}/modify`,
    data,
  );
}

// 删除支付设置
export function deleteSettingPaymentApi(data: SettingPaymentRemoveVO) {
  return requestClient.post(
    `${SETTING_PAYMENT_BASE_URL}/remove`,
    data,
  );
}

// 获取支付设置详情
export function getSettingPaymentDetailApi(data: { payment_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_PAYMENT_BASE_URL}/detail`,
    data,
  );
}

// 启用/禁用支付方式
export function togglePaymentStatusApi(data: { payment_id: number; status: string; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_PAYMENT_BASE_URL}/toggle-status`,
    data,
  );
}

// 更新支付方式排序
export function updatePaymentSortApi(data: { payment_ids: number[]; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_PAYMENT_BASE_URL}/update-sort`,
    data,
  );
}
