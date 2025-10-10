/**
 * 货币
 */

import { requestClient as request } from '#/api/request';

// import Http from '@/service';
const CURRENCY_BASE_URL = '/v1/merchant/basics/currency';
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CurrencyService {
  /**
   * 创建货币
   */
  public static async createCurrency(data: any) {
    return request.post(`${CURRENCY_BASE_URL}/create`, data);
  }
  /**
   * 删除货币
   */
  public static async deleteCurrency(data: any) {
    return request.post(`${CURRENCY_BASE_URL}/remove`, data);
  }
  /**
   * 获取货币列表
   */
  public static async getCurrencyList(data: any) {
    return request.post(`${CURRENCY_BASE_URL}/list`, data);
  }
  public static async getCurrencyPageList(data: any) {
    return request.post(`${CURRENCY_BASE_URL}/page-list`, data);
  }
  /**
   * 更新货币
   */
  public static async updateCurrency(data: any) {
    return request.post(`${CURRENCY_BASE_URL}/modify`, data);
  }
}
