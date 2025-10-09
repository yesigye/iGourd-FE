import { isEmpty } from '@igourd/utils';

import { requestClient } from '#/api/request';

// 获取折扣分页列表
export function getDiscountListApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/promotion/page-list',
    data,
  );
}

// 创建折扣
export function createDiscountApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/promotion/create',
    data,
  );
}

// 更新折扣
export function updateDiscountApi(form: any) {
  const data = {
    ...form,
    relation_product_label_id_list:
      form.relation_product_label_id_list
        ?.filter((i: any) => i.id)
        ?.map((i: any) => i.id) || undefined,
    relation_product_group_id_list:
      form.relation_product_group_id_list
        ?.filter((i: any) => i.id)
        ?.map((i: any) => i.id) || undefined,
    relation_product_id_list:
      form.relation_product_id_list
        ?.filter((i: any) => i.id)
        ?.map((i: any) => i.id) || undefined,
  };
  return requestClient.post(
    '/v1/merchant/basics/marketing/promotion/modify',
    data,
  );
}

// 删除折扣
export function deleteDiscountApi(discount_id_list: (number | string)[]) {
  return requestClient.post('/v1/merchant/basics/marketing/promotion/remove', {
    discount_id_list,
  });
}

// 更新折扣状态
export function updateDiscountStatusApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/promotion/update-status',
    data,
  );
}

// 获取折扣详情
export function getDiscountDetailApi(row: Record<string, any>) {
  return requestClient
    .post(`/v1/merchant/basics/marketing/promotion/detail`, {
      promotion_id: row.id,
    })
    .then((res) => {
      return {
        ...res,
        active_day_hours: res.active_day_hours?.map(Number) || [],
        // 处理默认值的问题
        relation_product_id_list: isEmpty(res.relation_product_list)
          ? [{}]
          : res.relation_product_list,

        relation_product_label_id_list: isEmpty(
          res.relation_product_label_id_list,
        )
          ? [{}]
          : res.relation_product_label_id_list,

        relation_product_group_id_list: isEmpty(
          res.relation_product_group_id_list,
        )
          ? [{}]
          : res.relation_product_group_id_list,
      };
    });
}
