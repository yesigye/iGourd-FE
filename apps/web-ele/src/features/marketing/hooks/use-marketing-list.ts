import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { marketingApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import MarketingDrawerFrom from '../components/marketing-drawer.vue';

// 定义行数据类型
interface MarketingInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  description: string;
  create_time: string;
}

export function useMarketingList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: MarketingDrawerFrom,
  });

  // 表格列配置
  const columns = computed(() => [
    {
      field: 'name',
      title: "{{t('marketing.name')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'type',
      title: "{{t('marketing.type')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: "{{t('marketing.status')}}",
      width: 100,
    },
    {
      field: 'start_date',
      title: "{{t('marketing.startDate')}}",
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'end_date',
      title: "{{t('marketing.endDate')}}",
      width: 120,
      sortable: true,
      formatter: 'formatDate',
    },
    {
      field: 'description',
      title: "{{t('marketing.description')}}",
      width: 200,
    },
    {
      field: 'create_time',
      title: "{{t('marketing.createTime')}}",
      width: 160,
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'action',
      title: "{{t('common.action')}}",
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: { default: 'action' },
    },
  ]);

  // 搜索表单配置
  const searchFormSchema = {
    type: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('marketing.pleaseSelectType')}}",
        options: [
          { label: '营销活动', value: 'activity' },
          { label: '优惠券', value: 'coupon' },
          { label: '促销活动', value: 'promotion' },
          { label: '折扣管理', value: 'discount' },
          { label: '价格管理', value: 'price' },
        ],
      },
    },
    status: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Select',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('marketing.pleaseSelectStatus')}}",
        options: [
          { label: '草稿', value: 'draft' },
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
          { label: '已过期', value: 'expired' },
          { label: '已取消', value: 'cancelled' },
        ],
      },
    },
    dateRange: {
      type: 'array',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'DatePicker',
      'x-class': 'w-full',
      'x-component-props': {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: t('marketing.startDate'),
        endPlaceholder: t('marketing.endDate'),
      },
    },
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        gridSpan: 'span 2',
      },
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('marketing.keywords')}}",
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<MarketingInfo> = {
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
  const gridOptions: VxeGridProps<MarketingInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'name',
    },
    filterConfig: {
      remote: true,
    },
    columns: columns.value,
    exportConfig: {},
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      form: false,
      ajax: {
        query: async ({ page }, form = {}) => {
          return await marketingApi.getPageList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: '1938848394566025217',
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
