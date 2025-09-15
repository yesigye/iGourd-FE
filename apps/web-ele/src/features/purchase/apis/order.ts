import { requestClient } from '#/api/request';
import type { ID, CurrencyQueryVO } from '../types';

export function purchaseOrderDelete(data: unknown) {
  return requestClient.post(
    '/v1/merchant/purchase/purchase-order/remove',
    data,
  );
}
export class PurchaseServiceOrder {
  //产品详情
  public static async productPageList(data: any) {
    return requestClient.post('/v1/merchant/basics/product/page-list', data);
  }
  //采购单列表
  public static async purchaseOrderList(data: any) {
    return requestClient.post(
      '/v1/merchant/purchase/purchase-order/page-list',
      data,
    );
  }
  //采购单审核
  public static async purchaseOrderAudit(data: any) {
    return requestClient.post(
      '/v1/merchant/purchase/purchase-order/review',
      data,
    );
  }
  //采购单添加
  public static async purchaseOrderCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/purchase/purchase-order/create',
      data,
    );
  }
  //采购单删除
  public static async purchaseOrderDelete(data: any) {
    return requestClient.post(
      '/v1/merchant/purchase/purchase-order/remove',
      data,
    );
  }
  //采购单详情
  public static async purchaseOrderDetail(data: { purchase_order_no: ID }) {
    return requestClient.post(
      '/v1/merchant/purchase/purchase-order/detail',
      data,
    );
  }
  //采购单修改
  public static async purchaseOrderUpdate(data: any) {
    return requestClient.post(
      '/v1/merchant/purchase/purchase-order/modify',
      data,
    );
  }
  //获取供应商列表
  public static async purchaseVendorPageList(data: {
    page_num: number;
    page_size: number;
    keywords: string;
  }) {
    return requestClient.post('/v1/merchant/purchase/vendor/page-list', data);
  }
  //获取仓库列表
  public static async inventoryWarehouse(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/list',
      data,
    );
  }
  //货币查询
  public static async basicsCurrencyList(data: CurrencyQueryVO) {
    return requestClient.post('/v1/merchant/basics/currency/list', data);
  }
  //采购单结算
  public static async purchaseOrderSettlement(data: any) {
    return requestClient.post(
      '/v1/merchant/purchase/purchase-order/settlement',
      data,
    );
  }
  // 采购单下商品资料分页查询
  public static async purchaseOrderProductPageList(data: any) {
    return requestClient.post(
      '/v1/merchant/purchase/purchase-order/product/page-list',
      data,
    );
  }
  //添加商品搜索
  public static async productSearch(data: any) {
    return requestClient.post('/v1/merchant/basics/inventory/search', data);
  }
}
