import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  SettingTemplateQueryPageVO,
  SettingTemplatePageModel,
  TemplateStatus,
  TemplateType,
} from '@@/setting/types';

import {
  getSettingTemplatePageListApi,
  deleteSettingTemplateApi,
  updateTemplateStatusApi,
  getTemplatePreviewApi,
  copyTemplateApi,
} from '@@/setting/apis';

export function useSettingTemplate() {
  const { t } = useI18n();
  const userStore = useUserStore();

  // 基础列定义
  const baseColumns = [
    {
      prop: 'template_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('setting.templateName'),
    },
    {
      prop: 'template_type',
      width: 150,
      align: 'center',
      title: t('setting.templateType'),
    },
    {
      prop: 'status',
      width: 100,
      align: 'center',
      title: t('setting.status'),
    },
    {
      prop: 'description',
      width: 200,
      align: 'left',
      title: t('setting.description'),
    },
    {
      prop: 'is_default',
      width: 100,
      align: 'center',
      title: t('setting.isDefault'),
    },
    {
      prop: 'sort_order',
      width: 100,
      align: 'center',
      title: t('setting.sortOrder'),
    },
    {
      prop: 'creator_name',
      width: 120,
      align: 'left',
      title: t('setting.creatorName'),
    },
    {
      prop: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('setting.createTime'),
    },
  ];

  // 查询参数
  const queryParams = ref<SettingTemplateQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<SettingTemplatePageModel[]>([]);

  // 当前视图
  const currentView = ref<TemplateType>('RECEIPT');

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: SettingTemplateQueryPageVO) => {
      const response = await getSettingTemplatePageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除模板设置
    remove: async (data: { template_id_list: number[]; merchant_id?: number }) => {
      return await deleteSettingTemplateApi(data);
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    handleEdit,
    handleDelete,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,
  } = useCrud({
    service,
    columns: baseColumns,
    searchFormSchema: [
      {
        type: 'input',
        name: 'keywords',
        title: t('setting.search'),
        placeholder: t('setting.searchPlaceholder'),
      },
      {
        type: 'select',
        name: 'status',
        title: t('setting.status'),
        options: [
          { label: t('setting.status.active'), value: 'ACTIVE' },
          { label: t('setting.status.inactive'), value: 'INACTIVE' },
          { label: t('setting.status.draft'), value: 'DRAFT' },
        ],
      },
      {
        type: 'select',
        name: 'template_type',
        title: t('setting.templateType'),
        options: [
          { label: t('setting.templateType.receipt'), value: 'RECEIPT' },
          { label: t('setting.templateType.barcodeLabel'), value: 'BARCODE_LABEL' },
          { label: t('setting.templateType.scanLabel'), value: 'SCAN_LABEL' },
          { label: t('setting.templateType.scanReceipt'), value: 'SCAN_RECEIPT' },
          { label: t('setting.templateType.scanTag'), value: 'SCAN_TAG' },
        ],
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [TemplateDrawer, { openDrawer: openTemplateDrawer }] = useDrawer<{ type: string; id?: number }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      template_type: val.searchVal?.template_type || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: SettingTemplatePageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openTemplateDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditTemplate = (row: SettingTemplatePageModel) => {
    openTemplateDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: SettingTemplatePageModel) => {
    openTemplateDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理状态切换
  const handleToggleStatus = async (row: SettingTemplatePageModel) => {
    try {
      const newStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateTemplateStatusApi({
        template_id: row.id,
        status: newStatus,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('切换状态失败:', error);
    }
  };

  // 处理预览
  const handlePreview = async (row: SettingTemplatePageModel) => {
    try {
      const response = await getTemplatePreviewApi({
        template_id: row.id,
        merchant_id: userStore.merchantId,
      });
      // 这里可以打开预览窗口或跳转到预览页面
      console.log('预览模板:', response.data);
    } catch (error) {
      console.error('预览模板失败:', error);
    }
  };

  // 处理复制
  const handleCopy = async (row: SettingTemplatePageModel) => {
    try {
      await copyTemplateApi({
        template_id: row.id,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('复制模板失败:', error);
    }
  };

  // 处理设置默认
  const handleSetDefault = async (row: SettingTemplatePageModel) => {
    try {
      // 这里需要调用设置默认模板的API
      console.log('设置默认模板:', row);
      refresh();
    } catch (error) {
      console.error('设置默认模板失败:', error);
    }
  };

  // 处理批量删除
  const handleBatchDeleteTemplate = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteSettingTemplateApi({
        merchant_id: userStore.merchantId,
        template_id_list: selectedRows.value.map(item => item.id),
      });
      refresh();
      selectedRows.value = [];
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  // 页码改变
  const handleCurrentChange = (val: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_num: val,
    };
  };

  // 页面大小改变
  const handleSizeChange = (val: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_size: val,
    };
  };

  return {
    // 组件
    Grid,
    TemplateDrawer,

    // 数据
    queryParams,
    selectedRows,
    currentView,

    // 配置
    columns: baseColumns,

    // 方法
    handleEdit,
    handleDelete,
    handleSearch,
    handleSelectionChange,
    handleAdd,
    handleEditTemplate,
    handleDetail,
    handleToggleStatus,
    handlePreview,
    handleCopy,
    handleSetDefault,
    handleBatchDeleteTemplate,
    handleCurrentChange,
    handleSizeChange,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,

    // API
    gridApi,
  };
}
