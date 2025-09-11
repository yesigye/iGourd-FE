import { requestClient } from '#/api/request';

export function purchaseOrderDelete(data: unknown) {
  return requestClient.post('/merchant/purchase/purchase-order/remove', data);
}
