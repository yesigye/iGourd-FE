import { requestClient } from '#/api/request';

export class WarehouseService {
  //仓库列表
  public static async warehouseList(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/list',
      data,
    );
  }
  //仓库添加
  public static async warehouseCreate(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/create',
      data,
    );
  }

  //仓库编辑
  public static async warehouseModify(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/modify',
      data,
    );
  }
  //仓库删除
  public static async warehouseRemove(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/remove',
      data,
    );
  }
  // 仓库是否销售状态开启
  public static async warehouseSaleStatus(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/sale/status/open',
      data,
    );
  }
  // 仓库列表分页查询
  public static async warehouseListPage(data: any, customerHeader = {}) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/page-list',
      data,
      customerHeader,
    );
  }

  public static productStockPackageChange(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/stock/package-change',
      data,
    );
  }

  public static productStockMergePackage(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/stock/merge-package',
      data,
    );
  }

  public static productStockSplitPackage(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/product/stock/split-package',
      data,
    );
  }

  public static warehouseStockList(data: any) {
    return requestClient.post(
      '/v1/merchant/basics/inventory/warehouse/stock/list',
      data,
    );
  }
}
