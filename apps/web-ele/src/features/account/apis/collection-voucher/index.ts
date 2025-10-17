import type {
  ReceiptOrderQueryPageVO,
  ReceiptOrderPageModel,
  ReceiptOrderDetailModel,
  ReceiptOrderRemoveVO,
  ReceiptOrderCreateVO,
  ReceiptOrderModifyVO,
  MerchantPaymentMethodConfigModel,
  PaymentMethodConfigQueryVO,
  ReceiptOrderReviewVO,
} from '@@/account/types';

import { requestClient } from '#/api/request';
import { orderNoGenerate } from '#/api';

// 获取收款单分页列表
export function getReceiptOrderPageListApi(data: ReceiptOrderQueryPageVO) {
  return requestClient.post(`/v1/merchant/order/receipt-order/page-list`, data);
}

// 获取收款单详情
export function getReceiptOrderDetailApi({ id }: { id: number }) {
  return requestClient
    .post(`/v1/merchant/order/receipt-order/detail`, {
      receipt_order_id: id,
    })
    .then((res) => {
      return {
        ...res,
        receipt_order_item_list: res.receipt_order_item_detail_models,
        business_order: res.receipt_order_item_detail_models?.map((i: any) => {
          return {
            ...i.business_order,
            receipt_order_id: i.receipt_order_id,
            create_time: i.create_time,
          };
        }),
      };
    });
}

// 删除收款单
export function removeReceiptOrderApi(data: ReceiptOrderRemoveVO) {
  return requestClient.post(`/v1/merchant/order/receipt-order/remove`, data);
}
// 创建收款单
export async function createReceiptOrderApi(data: ReceiptOrderCreateVO) {
  // const {payment_order_item_list:[first],...reset} = data
  // data = {
  //   ...reset,
  //   ...data.[]
  // }
  const { order_no } = await orderNoGenerate({
    category_type: 'RECEIPT_ORDER',
  });
  data.receipt_order_no = order_no;
  return requestClient.post(`/v1/merchant/order/receipt-order/create`, data);
}

// 修改收款单
export function modifyReceiptOrderApi(data: ReceiptOrderModifyVO) {
  return requestClient.post(`/v1/merchant/order/receipt-order/modify`, data);
}

// 审核收款单
export function reviewReceiptOrderApi(data: ReceiptOrderReviewVO) {
  return requestClient.post(`/v1/merchant/order/receipt-order/review`, data);
}

// 获取支付方式配置列表
export function getPaymentMethodConfigListApi(
  data: PaymentMethodConfigQueryVO,
) {
  return requestClient.post(
    `/v1/merchant/order/merchant-payment-method-config/list`,
    data,
  );
}

// 修改收款单状态
export function modifyReceiptOrderStatusApi(data: {
  merchant_id?: number;
  receipt_order_id: number;
  review_status: string;
}) {
  return requestClient.post(
    `/v1/merchant/order/receipt-order/modify-status`,
    data,
  );
}
