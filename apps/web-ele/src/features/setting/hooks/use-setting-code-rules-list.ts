import type { Ref } from 'vue';

import type {
  VxeGridListeners,
  VxeGridProps,
  VxeGridPropTypes,
} from '#/adapter/vxe-table';
import type { PurchaseCustomizedInfo } from '#/features/purchase/types';

import { computed } from 'vue';

import { confirm, useIgourdDrawer } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import { useIgourdVxeGrid } from '#/adapter/vxe-table';

import { codingCategoryList } from '../apis/rules';
import settingCodeRulesDrawer from '../components/setting-code-rules-drawer.vue';

export function useSettingCodeRulesList(type: Ref<string>) {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: settingCodeRulesDrawer,
    appendToMain: true,
  });
  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns: VxeGridPropTypes.Column<PurchaseCustomizedInfo>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'category_type',
      title: t('code-rules.receipt-type'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'name',
      title: t('code-rules.coding-rules'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'paragraph_break',
      title: t('code-rules.paragraph-break'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'code_section',
      title: t('code-rules.code-section'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'status',
      title: t('code-rules.status'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'operation',
      title: t('code-rules.operation'),
      sortable: true,
      minWidth: 180,
      slots: { default: 'operation' },
    },
  ];

  // 搜索表单配置 - 基于原有的 queryParams 对象
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<PurchaseCustomizedInfo> = {
    checkboxChange(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
    checkboxAll(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<PurchaseCustomizedInfo> = {
    columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await codingCategoryList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: currentLoginUserApp.owner_id,
            tree_type: type.value,
            ...form,
          });
        },
      },
    },
  };

  // 使用 useIgourdVxeGrid
  const [Grid, gridApi] = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
  });
  async function handleEdit(row?: PurchaseCustomizedInfo) {
    drawerApi.setData(row || {}).open();
  }
  const canBatchDelete = computed(() => checkedKeys.value.length > 0);
  function batchDelete() {
    confirm({
      title: t('purchase.deleteConfirmTitle'),
      content: t('purchase.deleteConfirmText'),
    })
      .then(() => {
        // return deleteDynamicColumn({
        //   dynamic_column_id_list: checkedKeys.value,
        //   merchant_id: currentLoginUserApp.owner_id,
        // });
      })
      .then(() => {
        gridApi.reload();
        // checkedKeys.value = [];
      });
  }
  return {
    // 组件
    Grid,
    Drawer,
    gridApi,
    drawerApi,
    handleEdit,
    // 配置
    columns,
    searchFormSchema,
    gridEvents,
    gridOptions,
    canBatchDelete,
    batchDelete,
  };
}
