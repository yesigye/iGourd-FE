/**
 * 商户管理
 */
import { requestClient as request } from '#/api/request';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BusinessService {
  // 创建商户
  public static async basicsMerchantCreate(data: any) {
    return request.post('/v1/merchant/basics/merchant/create', data);
  }
  // 获取业务类型
  public static async businessTypeList(data: any) {
    return request.post(
      '/v1/merchant/basics/merchant/business-type/list',
      data,
    );
  }
  // 查询各国家语言List
  public static async countryLanguagelist(data: any) {
    return request.post(
      '/v1/merchant/basics/merchant/country-language/list',
      data,
    );
  }
  // 基于商户ID查询商户信息
  public static async getMerchantInfo(id: any) {
    return request.get(`/v1/merchant/basics/merchant/find/${id}`);
  }
  // 获取行业
  public static async merchantIndustryList(data: any) {
    return request.post('/v1/merchant/basics/merchant/industry/list', data);
  }
  // 获取套餐详情
  public static async merchantPackageList(data: any) {
    return request.post('/v1/merchant/basics/merchant/package/list', data);
  }
  // 商户已付款
  public static async merchantPackagePaid(data: any) {
    return request.post('/v1/merchant/basics/merchant/package/paid', data);
  }
  // 商户所有子商户信息查询（分页）
  public static async merchantSubMerchantList(data: any) {
    return request.post('/v1/merchant/basics/merchant/page-list', data);
  }
  // 商户信息修改
  public static async merchantUpdate(data: any) {
    return request.post('/v1/merchant/basics/merchant/modify', data);
  }
  // 商户下单
  public static async packagePlaceOrder(data: any) {
    return request.post(
      '/v1/merchant/basics/merchant/package/place-order',
      data,
    );
  }
}
