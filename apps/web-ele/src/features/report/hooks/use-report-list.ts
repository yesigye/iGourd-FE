import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { reportApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import ReportDrawerFrom from '../components/report-drawer.vue';

// 定义行数据类型
interface ReportInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  create_time: string;
}

export function useReportList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ReportDrawerFrom,
  });

  // 表格列配置
  const columns = computed(() => [


    {
      field: 'name',
      title: "{{t('report.name')}}",
      width: 150,
      sortable: true,
    },
    {
      field: 'type',
      title: "{{t('report.type')}}",
      width: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: "{{t('report.status')}}",
      width: 100,
    },
    {
      field: 'description',
      title: "{{t('report.description')}}",
      width: 200,
    },
    {
      field: 'create_time',
      title: "{{t('report.createTime')}}",
      width: 160,
      sortable: true,
      formatter: 'formatDateTime',
    },
  ]);

  // 搜索表单配置
  const searchFormSchema = {type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('report.pleaseSelectType')}}",
          options: [
            { label: '客户报表', value: 'customer' },
            { label: '财务报表', value: 'financial' },
            { label: '库存报表', value: 'inventory' },
            { label: '销售报表', value: 'sales' },
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
          placeholder: "{{t('report.pleaseSelectStatus')}}",
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
            { label: '草稿', value: 'draft' },
            { label: '已发布', value: 'published' },
          ],
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
          placeholder: "{{t('report.keywords')}}",
        },
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<ReportInfo> = {
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
  const gridOptions: VxeGridProps<ReportInfo> = {
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
          return await reportApi.getPageList({
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






