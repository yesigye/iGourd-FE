import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { marketingApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import MarketingActivityDrawerFrom from '../components/marketing-activity-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface MarketingActivityInfo {
  id: string;
  activity_name: string;
  activity_type: string;
  activity_status: string;
  start_time: string;
  end_time: string;
  target_audience: string;
  budget: number;
  actual_cost: number;
  creator_name: string;
  create_time: string;
}

export function useMarketingActivityList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: MarketingActivityDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'activity_name',
      title: "{{t('marketing.activityName')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'activity_type',
      title: "{{t('marketing.activityType')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 活动类型列需要特殊处理，使用自定义渲染
      slots: { default: 'activity_type' },
    },
    {
      field: 'activity_status',
      title: "{{t('marketing.activityStatus')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 活动状态列需要特殊处理，使用自定义渲染
      slots: { default: 'activity_status' },
    },
    {
      field: 'start_time',
      title: "{{t('marketing.startTime')}}",
      width: 160,
      align: 'left',
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'end_time',
      title: "{{t('marketing.endTime')}}",
      width: 160,
      align: 'left',
      sortable: true,
      formatter: 'formatDateTime',
    },
    {
      field: 'target_audience',
      title: "{{t('marketing.targetAudience')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 目标受众列需要特殊处理，使用自定义渲染
      slots: { default: 'target_audience' },
    },
    {
      field: 'budget',
      title: "{{t('marketing.budget')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 预算列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'actual_cost',
      title: "{{t('marketing.actualCost')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 实际成本列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'creator_name',
      title: "{{t('marketing.creator')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'create_time',
      title: "{{t('marketing.creationTime')}}",
      width: 180,
      align: 'left',
      sortable: true,
      formatter: 'formatDateTime',
    },
  ]);

  // 搜索表单配置 - 基于原有的查询参数
  const searchFormSchema = {keywords: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.keywords')}}",
          clearable: true,
        },
      },
      activity_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.activityName')}}",
          clearable: true,
        },
      },
      activity_type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectActivityType')}}",
          clearable: true,
          options: [
            { label: "{{t('marketing.activity_type_PROMOTION'), value: 'PROMOTION' },
            { label: "{{t('marketing.activity_type_DISCOUNT'), value: 'DISCOUNT' },
            { label: "{{t('marketing.activity_type_COUPON'), value: 'COUPON' },
            { label: "{{t('marketing.activity_type_GIFT'), value: 'GIFT' },
            { label: "{{t('marketing.activity_type_EVENT'), value: 'EVENT' },
          ],
        },
      },
      activity_status: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectActivityStatus')}}",
          clearable: true,
          options: [
            { label: "{{t('marketing.activity_status_DRAFT'), value: 'DRAFT' },
            { label: "{{t('marketing.activity_status_ACTIVE'), value: 'ACTIVE' },
            { label: "{{t('marketing.activity_status_PAUSED'), value: 'PAUSED' },
            { label: "{{t('marketing.activity_status_COMPLETED'), value: 'COMPLETED' },
            { label: "{{t('marketing.activity_status_CANCELLED'), value: 'CANCELLED' },
          ],
        },
      },
      target_audience: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectTargetAudience')}}",
          clearable: true,
          options: [
            { label: "{{t('marketing.target_audience_ALL'), value: 'ALL' },
            { label: "{{t('marketing.target_audience_NEW'), value: 'NEW' },
            { label: "{{t('marketing.target_audience_EXISTING'), value: 'EXISTING' },
            { label: "{{t('marketing.target_audience_VIP'), value: 'VIP' },
          ],
        },
      },
      start_date: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.startDate')}}",
          type: 'date',
          clearable: true,
        },
      },
      end_date: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'DatePicker',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.endDate')}}",
          type: 'date',
          clearable: true,
        },
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<MarketingActivityInfo> = {
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
  const gridOptions: VxeGridProps<MarketingActivityInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'activity_name',
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
          return await marketingApi.getActivityList({
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
    formOptions: { schema: searchFormSchema, scope: {} }
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






