import type {
  SettingTemplateQueryPageVO,
  SettingTemplatePageModel,
  SettingTemplateCreateVO,
  SettingTemplateModifyVO,
  SettingTemplateRemoveVO,
  SettingTemplateDetailModel,
} from '@@/setting/types';

import { requestClient } from '#/api/request';

const SETTING_TEMPLATE_BASE_URL = '/merchant/setting/template';

// 获取模板设置分页列表
export function getSettingTemplatePageListApi(data: SettingTemplateQueryPageVO) {
  return requestClient.post(
    `${SETTING_TEMPLATE_BASE_URL}/page-list`,
    data,
  );
}

// 创建模板设置
export function createSettingTemplateApi(data: SettingTemplateCreateVO) {
  return requestClient.post(
    `${SETTING_TEMPLATE_BASE_URL}/create`,
    data,
  );
}

// 更新模板设置
export function updateSettingTemplateApi(data: SettingTemplateModifyVO) {
  return requestClient.post(
    `${SETTING_TEMPLATE_BASE_URL}/modify`,
    data,
  );
}

// 删除模板设置
export function deleteSettingTemplateApi(data: SettingTemplateRemoveVO) {
  return requestClient.post(
    `${SETTING_TEMPLATE_BASE_URL}/remove`,
    data,
  );
}

// 获取模板设置详情
export function getSettingTemplateDetailApi(data: { template_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_TEMPLATE_BASE_URL}/detail`,
    data,
  );
}

// 更新模板设置状态
export function updateTemplateStatusApi(data: { template_id: number; status: string; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_TEMPLATE_BASE_URL}/update-status`,
    data,
  );
}

// 获取模板预览
export function getTemplatePreviewApi(data: { template_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_TEMPLATE_BASE_URL}/preview`,
    data,
  );
}

// 复制模板
export function copyTemplateApi(data: { template_id: number; merchant_id?: number }) {
  return requestClient.post(
    `${SETTING_TEMPLATE_BASE_URL}/copy`,
    data,
  );
}
