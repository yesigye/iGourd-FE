// /v{version}/merchant/basics/inventory/stock/warning/page-list
import { requestClient as request } from '#/api/request';
// 库存预警分页
export function getStockWarningPageListApi(params: {
  is_maximum: string;
  is_minimum: string;
  is_safety: string;
  merchant_id: string;
  page_num: number;
  page_size: number;
}) {
  return request.post(
    '/v1/merchant/basics/inventory/stock/warning/page-list',
    params,
  );
}
