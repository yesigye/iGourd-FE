import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { employeeApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

// 定义操作日志数据类型
interface OperationLogInfo {
  id: string;
  user_name: string;
  operation_type: string;
  operation_content: string;
  ip_address: string;
  user_agent: string;
  create_time: string;
}

export function useEmployeeOperationLogList() {
  const { t } = useI18n();
  
  // 搜索表单配置
  const searchFormSchema = {
    type: 'object',
    properties: {
      keywords: {
        type: 'string',
        title: "{{t('employee.pleaseOperationLog')}}",
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('employee.pleaseOperationLog')}}",
          clearable: true,
        },
      },
    },
  };

  // 表格列配置
  const columns = [
    {
      field: 'user_name',
      title: "{{t('employee.userName')}}",
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'operation_type',
      title: "{{t('employee.operationType')}}",
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'operation_content',
      title: "{{t('employee.operationContent')}}",
      width: 300,
      showOverflow: 'tooltip',
    },
    {
      field: 'ip_address',
      title: "{{t('employee.ipAddress')}}",
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'user_agent',
      title: "{{t('employee.userAgent')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'create_time',
      title: "{{t('employee.operationTime')}}",
      width: 180,
    },
  ];

  // Grid 事件配置
  const gridEvents: VxeGridListeners<OperationLogInfo> = {
    filterChange({ $grid, filterList }) {
      const query: Record<string, unknown> = {};
      filterList.forEach((item) => {
        query[item.field] = item.values;
      });
      $grid.commitProxy('reload', query);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<OperationLogInfo> = {
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
          return await employeeApi.getOperationLogList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            ...form,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: true,
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
    gridApi,

    // 配置
    columns,
    searchFormSchema,
    gridEvents,
    gridOptions,
  };
}

