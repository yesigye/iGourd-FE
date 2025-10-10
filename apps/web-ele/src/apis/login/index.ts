/* eslint-disable @typescript-eslint/no-extraneous-class */
import { requestClient as request } from '#/api/request';

export class LoginService {
  // 查询商户信息
  public static async basicsMerchantList(data, headersdata) {
    return request.post('/v1/merchant/basics/merchant/list', data, {
      headers: { ...headersdata },
    });
  }
  // 查询国家区号
  public static async countryAreas(data) {
    return request.get('/v1/passport/basics/country/areas/list', data);
  }
  // 基于商户ID查询商户设置的国家语言信息（主语言/辅语言）
  public static async countryLanguageFind(data) {
    return request.get(
      `/v1/merchant/basics/merchant/country-language/find/${data.merchantid}`,
      data,
    );
  }
  // 基于商户ID查询商户列表
  public static async findMerchantList(data) {
    return request.post(
      `/v1/merchant/basics/merchant/list/same-merchant/${data.merchantid}`,
      data,
    );
  }
  // 忘记密码
  public static async forgetPass(data) {
    return request.post('/v1/passport/forget/password', data);
  }
  // 登录
  public static async login(data) {
    return request.post('/v1/passport/login', data);
  }
  // 退出登录
  public static async logout() {
    return request.post('/v1/passport/logout');
  }
  // 注册
  public static async normalCreate(data) {
    return request.post('/v1/merchant/basics/passport/register', data);
  }
  // 登录后,选择一个Owner切换
  public static async ownerSelection(data, headersdata) {
    return request.post('/v1/passport/owner/selection', data, {
      headers: { ...headersdata },
    });
  }
  // 校验密码 /v{version}/passport/user/password/verification
  public static async passwordVerification(data) {
    return request.post('/v1/passport/user/password/verification', data);
  }
  // 国家时区信息查询
  public static async timezone(data) {
    return request.get('/v1/passport/basics/country/timezone/list', data);
  }
  // 获取验证码
  public static async verificationCode(data) {
    return request.post('/v1/passport/verification-code', data);
  }
}
