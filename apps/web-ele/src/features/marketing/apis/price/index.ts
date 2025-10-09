import { isEmpty } from '@igourd/utils';

import { requestClient } from '#/api/request';

// 获取价格分页列表
export function getPriceListApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/price-level/page-list',
    data,
  );
}

export function createOrUpdatePriceApi(data: any) {
  const {
    relation_product_list,
    relation_product_label_list,
    relation_product_group_list,
    ...reset
  } = data;
  const params = {
    ...reset,
    relation_product_id_list:
      relation_product_list?.map((item: any) => item.id).filter(Boolean) || [],

    relation_product_label_id_list:
      relation_product_label_list
        ?.map((item: any) => item.id)
        .filter(Boolean) || [],

    relation_product_group_id_list:
      relation_product_group_list
        ?.map((item: any) => item.id)
        .filter(Boolean) || [],
  };
  if (Reflect.has(data, 'id')) {
    return updatePriceApi(params);
  }
  return createPriceApi(params);
}
// 创建价格
function createPriceApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/price-level/create',
    data,
  );
}

// 更新价格
function updatePriceApi(data: any) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/price-level/modify',
    data,
  );
}

// 删除价格
export function deletePriceApi(price_id_list: (number | string)[]) {
  return requestClient.post(
    '/v1/merchant/basics/marketing/price-level/remove',
    {
      price_id_list,
    },
  );
}

// 更新价格状态
export function updatePriceStatusApi(data: any) {
  return requestClient.post(
    `/v1/merchant/basics/marketing/price-level/status/${data.status.toLowerCase()}`,
    data,
  );
}

// 获取价格详情
export function getPriceDetailApi(row: Record<string, any>) {
  return requestClient
    .post(`/v1/merchant/basics/marketing/price-level/detail`, {
      price_level_id: row.id,
    })
    .then((res) => {
      return {
        ...res,
        active_day_hours: res.active_day_hours?.map(Number) || [],
        // 处理默认值的问题
        relation_product_list: isEmpty(res.relation_product_list)
          ? [{}]
          : res.relation_product_list,

        relation_product_label_list: isEmpty(res.relation_product_label_list)
          ? [{}]
          : res.relation_product_label_list,

        relation_product_group_list: isEmpty(res.relation_product_group_list)
          ? [{}]
          : res.relation_product_group_list,
      };
    });
}
