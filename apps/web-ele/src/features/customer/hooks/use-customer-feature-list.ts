import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { customerApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

// 定义客户特性数据类型
interface CustomerFeatureInfo {
  id: string;
  name: string;
  type: string;
  is_fixed_option: boolean;
  is_compulsory: boolean;
  creator_name: string;
  create_time: string;
}

export function useCustomerFeatureList() {
  const { t } = useI18n();
  
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: () => import('../components/customer-feature-drawer.vue'),
  });

  // 搜索表单配置
  const searchFormSchema = {
    type: 'object',
    properties: {
      keywords: {
        type: 'string',
        title: "{{t('purchase.placeholder')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('purchase.placeholder')}}",
          clearable: true,
        },
      },
    },
  };

  // 表格列配置
  const columns = [
    {
      field: 'name',
      title: "{{t('customers.name')}}",
      width: 300,
      fixed: 'left',
      showOverflow: 'tooltip',
    },
    {
      field: 'type',
      title: "{{t('customers.type')}}",
      width: 180,
      slots: { default: 'type' },
    },
    {
      field: 'is_fixed_option',
      title: "{{t('customers.isFixedOption')}}",
      width: 200,
      slots: { default: 'is_fixed_option' },
    },
    {
      field: 'is_compulsory',
      title: "{{t('customers.isCompulsory')}}",
      width: 180,
      slots: { default: 'is_compulsory' },
    },
    {
      field: 'creator_name',
      title: "{{t('customers.creator')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'create_time',
      title: "{{t('customers.creationTime')}}",
      width: 180,
    },
  ];

  // 最大项目数量限制
  const maxItems = 5;
  const isMaxItems = computed(() => {
    // 这里应该从实际数据中获取当前项目数量
    // 暂时返回 false，实际使用时需要根据数据动态计算
    return false;
  });

  // Grid 事件配置
  const gridEvents: VxeGridListeners<CustomerFeatureInfo> = {
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
  const gridOptions: VxeGridProps<CustomerFeatureInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'name',
    },
    filterConfig: {
      remote: true,
    },
    columns: columns,
    exportConfig: {},
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      form: false,
      ajax: {
        query: async ({ page }, form = {}) => {
          return await customerApi.getFeatureList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            entity: 'CUSTOMER',
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
  const { Grid, gridApi } = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
    formOptions: { schema: searchFormSchema },
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
    isMaxItems,
  };
}

