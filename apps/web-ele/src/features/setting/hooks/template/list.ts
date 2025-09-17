import type { SettingTemplatePageModel } from '@@/setting/types';

import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { useI18n } from '@igourd/locales';

import {
  getSettingTemplatePageListApi,
  deleteSettingTemplateApi,
  updateTemplateStatusApi,
  getTemplatePreviewApi,
  copyTemplateApi,
} from '@@/setting/apis';
import { SettingTemplateDrawer } from '@@/setting/components';

import { useCrud } from '#/hooks';

export function useSettingTemplate() {
  const { t } = useI18n();

  // 基础列定义
  const baseColumns: VxeGridPropTypes.Column<SettingTemplatePageModel>[] = [
    {
      field: 'template_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('setting.templateName'),
      sortable: true,
    },
    {
      field: 'template_type',
      width: 150,
      align: 'center',
      title: t('setting.templateType'),
      sortable: true,
    },
    {
      field: 'status',
      width: 100,
      align: 'center',
      title: t('setting.status'),
      sortable: true,
    },
    {
      field: 'description',
      width: 200,
      align: 'left',
      title: t('setting.description'),
      sortable: true,
    },
    {
      field: 'is_default',
      width: 100,
      align: 'center',
      title: t('setting.isDefault'),
      sortable: true,
    },
    {
      field: 'sort_order',
      width: 100,
      align: 'center',
      title: t('setting.sortOrder'),
      sortable: true,
    },
    {
      field: 'creator_name',
      width: 120,
      align: 'left',
      title: t('setting.creatorName'),
      sortable: true,
    },
    {
      field: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('setting.createTime'),
      sortable: true,
    },
  ];

  // 服务函数
  const service = {
    // 获取列表数据
    query: getSettingTemplatePageListApi,

    // 删除模板设置
    remove: deleteSettingTemplateApi,
  };

  // 使用 CRUD Hook
  const { Grid, canBatchOperate, Drawer, handleEdit, handleBatchDelete } =
    useCrud({
      service,
      columns: baseColumns,
      searchFormSchema: {
        keywords: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: t('setting.searchPlaceholder'),
          },
        },
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('setting.status'),
            options: [
              { label: t('setting.status.active'), value: 'ACTIVE' },
              { label: t('setting.status.inactive'), value: 'INACTIVE' },
              { label: t('setting.status.draft'), value: 'DRAFT' },
            ],
          },
        },
        template_type: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: t('setting.templateType'),
            options: [
              { label: t('setting.templateType.receipt'), value: 'RECEIPT' },
              { label: t('setting.templateType.barcodeLabel'), value: 'BARCODE_LABEL' },
              { label: t('setting.templateType.scanLabel'), value: 'SCAN_LABEL' },
              { label: t('setting.templateType.scanReceipt'), value: 'SCAN_RECEIPT' },
              { label: t('setting.templateType.scanTag'), value: 'SCAN_TAG' },
            ],
          },
        },
      },
      batchOperate: true, // 支持批量删除
      connectedComponent: SettingTemplateDrawer,
    });


  return {
    Grid,
    Drawer,
    handleEdit,
    handleBatchDelete,
    canBatchOperate,
  };
}
