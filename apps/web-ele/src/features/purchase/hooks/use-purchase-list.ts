import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { purchaseApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import PurchaseDrawerFrom from '../components/purchase-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface PurchaseInfo {
  id: string;
  profile_photo: string;
  name: string;
  contact_name: string;
  contact_telephone: string;
  address: string;
  creator_name: string;
  create_time: string;
}

export function usePurchaseList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [
    {
      field: 'profile_photo',
      title: "{{t('purchase.profilePhoto')}}",
      width: 80,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'name',
      title: "{{t('purchase.vendorName')}}",
      width: 155,
      sortable: true,
      fixed: 'left',
    },
    {
      field: 'contact_name',
      title: "{{t('purchase.name')}}",
      width: 160,
      sortable: true,
    },
    {
      field: 'contact_telephone',
      title: "{{t('purchase.contactTelephone')}}",
      width: 200,
      sortable: true,
    },
    {
      field: 'address',
      title: "{{t('purchase.address')}}",
      width: 200,
      sortable: true,
    },
    {
      field: 'creator_name',
      title: "{{t('purchase.creator')}}",
      width: 200,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: "{{t('purchase.createTime')}}",
      width: 180,
      sortable: true,
      align: 'left',
      formatter: 'formatDateTime',
    },
  ]);

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
        placeholder: "{{t('purchase.placeholder_vendor')}}",
        clearable: true
      }
    }
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<PurchaseInfo> = {
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
  const gridOptions: VxeGridProps<PurchaseInfo> = {
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
          return await purchaseApi.getPageList({
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
