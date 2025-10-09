import { PrintTemplateBusinessTypeEnum } from '@@/setting/types';

import { requestClient } from '#/api/request';
// 获取打印模板列表
export function getPrintTemplateList(data: {
  type: keyof typeof PrintTemplateBusinessTypeEnum;
}) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/option/list`,
    data,
  );
}
// 删除模板
export function deletePrintTemplate(data: {
  print_template_merchant_id_list: string[];
}) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/remove`,
    data,
  );
}
// 设置默认模板
export function setDefaultPrintTemplate(data: {
  business_type: keyof typeof PrintTemplateBusinessTypeEnum;
  id: string;
}) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/default/modify`,
    data,
  );
}
// 获取备选项字段
export function getPrintTemplateOptionList(data: {
  business_type: keyof typeof PrintTemplateBusinessTypeEnum;
}) {
  return requestClient.post(
    `/v1/merchant/basics/settings/print-template-merchant/option/list`,
    data,
  );
}
