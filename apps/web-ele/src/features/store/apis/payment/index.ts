import { request } from '@/utils/request';
import type { PaymentMethodItem, PaymentMethodParams, PaymentMethodMarkItem } from '../../types/payment';

/**
 * 获取支付方式列表
 */
export function getPaymentMethodList(params: PaymentMethodParams) {
  return request.post<{ data: PaymentMethodItem[] }>('/settings/payment-method/list', params);
}

/**
 * 获取支付方式标记列表
 */
export function getPaymentMethodMarkList(params: { merchant_id: number }) {
  return request.get<{ data: PaymentMethodMarkItem[] }>('/settings/payment-method/mark-list', params);
}

/**
 * 创建支付方式
 */
export function createPaymentMethod(params: {
  merchant_id: number;
  payment_method_mark: string;
  sort: number;
}) {
  return request.post('/settings/payment-method/create', params);
}

/**
 * 删除支付方式
 */
export function deletePaymentMethod(params: {
  merchant_id: number;
  payment_method_mark: string;
}) {
  return request.post('/settings/payment-method/delete', params);
}

/**
 * 编辑支付方式
 */
export function editPaymentMethod(params: {
  merchant_id: number;
  payment_method_mark: string;
  payment_method_operate: Record<string, boolean>;
}) {
  return request.post('/settings/payment-method/edit', params);
}

/**
 * 排序支付方式
 */
export function sortPaymentMethod(params: {
  merchant_id: number;
  payment_method_sort_map: Record<string, number>;
}) {
  return request.post('/settings/payment-method/sort', params);
}