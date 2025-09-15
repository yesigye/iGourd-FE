// 获取供应商列表
import { requestClient } from '#/api/request';

export async function purchaseVendorPageList(data: {
  keywords: string;
  page_num: number;
  page_size: number;
}) {
  return requestClient
    .post('/v1/merchant/purchase/vendor/page-list', data)
    .then(({ list }) => {
      return list.map((item: any) => {
        return {
          ...item,
          label: item.name,
          value: item.id,
        };
      });
    });
}
