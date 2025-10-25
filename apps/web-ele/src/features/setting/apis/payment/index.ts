import { requestClient } from '#/api/request';

// 修改店铺设置
export function paymentMethodListUsingPOST(data) {
  return requestClient.post(
    `/v1/merchant/order/merchant-payment-method-config/payment-method/list`,
    data,
  );
}
// 修改店铺设置
export function merchantPaymentMethodCreate(data) {
  return requestClient.post(
    `/v1/merchant/order/merchant-payment-method-config/create`,
    data,
  );
}
// 修改店铺设置
export function merchantPaymentMethodDel(data) {
  return requestClient.post(
    `/v1/merchant/order/merchant-payment-method-config/remove`,
    data,
  );
}
// 修改店铺设置
export function merchantPaymentMethodEdit(data: any) {
  return requestClient.post(
    `/v1/merchant/order/merchant-payment-method-config/modify`,
    data,
  );
}
// 获取付款方式
export function merchantPaymentMethodList(data: any) {
  return requestClient.post(`/v1/merchant/order/payment-method/list`, data);
}
export function merchantPaymentMethodOption(data: any) {
  return merchantPaymentMethodList(data).then((res) => {
    return {
      list: res?.map((i) => {
        return {
          ...i,
          value: i.type.value,
          label: i.name,
        };
      }),
    };
  });
}

// 修改店铺设置
export function merchantPaymentMethodSort(data) {
  return requestClient.post(
    `/v1/merchant/order/merchant-payment-method-config/sort`,
    data,
  );
}
// 修改店铺设置
export function listByEnumTypeUsing(data) {
  return requestClient.post(`/v1/merchant/common/enum/by-type`, data);
}

// export function
