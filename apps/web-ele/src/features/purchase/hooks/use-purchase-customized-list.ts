import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import PurchaseCustomizedDrawerFrom from '../components/purchase-customized-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface PurchaseCustomizedInfo {
  id: string;
  name: string;
  type: string;
  is_fixed_option: boolean;
  is_compulsory: boolean;
  creator_name: string;
  create_time: string;
}

export function usePurchaseCustomizedList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseCustomizedDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = [
    {
      field: 'name',
      title: t('customized.name'),
      width: 170,
      sortable: true,
      fixed: 'left',
      align: 'left',
    },
    {
      field: 'type',
      title: t('purchase.featureType'),
      width: 180,
      sortable: true,
      align: 'left',
      // 类型列需要特殊处理，使用自定义渲染
      slots: { default: 'type' },
    },
    {
      field: 'is_fixed_option',
      title: t('purchase.selectionType'),
      width: 200,
      sortable: true,
      align: 'left',
      // 选择类型列需要特殊处理，使用自定义渲染
      slots: { default: 'is_fixed_option' },
    },
    {
      field: 'is_compulsory',
      title: t('purchase.compulsory'),
      width: 150,
      sortable: true,
      align: 'left',
      // 是否必填列需要特殊处理，使用自定义渲染
      slots: { default: 'is_compulsory' },
    },
    {
      field: 'creator_name',
      title: t('purchase.creator'),
      width: 180,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('purchase.creationTime'),
      width: 180,
      sortable: true,
      align: 'left',
      formatter: 'formatDateTime',
    },
  ];

  // 搜索表单配置 - 基于原有的 queryParams 对象
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('purchase.keywords')}}",
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<PurchaseCustomizedInfo> = {
    cellClick: ({ row }) => {
      drawerApi.setData(row).open();
    },
    filterChange({ $grid, filterList }) {
      const query: Record<string, unknown> = {};
      filterList.forEach((item) => {
        query[item.field] = item.values;
      });
      $grid.commitProxy('reload', query);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<PurchaseCustomizedInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'name',
    },
    filterConfig: {
      remote: true,
    },
    columns,
    exportConfig: {},
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      form: false,
      ajax: {
        query: async ({ page }, form = {}) => {
          return await purchaseApi.getCustomizedList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: '1938848394566025217',
            entity: 'VENDOR',
            ...form,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      import: false,
      refresh: true,
      zoom: true,
    },
  };

  // 使用 useIgourdVxeGrid
  const [Grid, gridApi] = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
    formOptions: { schema: searchFormSchema, scope: {} },
  });

  return {
    // 组件
    Grid,
    Drawer,
    gridApi,
    drawerApi,

    // 配置
    columns,
    searchFormSchema,
    gridEvents,
    gridOptions,
  };
}
