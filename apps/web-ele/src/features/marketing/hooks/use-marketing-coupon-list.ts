import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { marketingApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import MarketingCouponDrawerFrom from '../components/marketing-coupon-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface MarketingCouponInfo {
  id: string;
  coupon_name: string;
  coupon_code: string;
  coupon_type: string;
  discount_value: number;
  minimum_amount: number;
  usage_limit: number;
  used_count: number;
  start_time: string;
  end_time: string;
  status: string;
  creator_name: string;
  create_time: string;
}

export function useMarketingCouponList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: MarketingCouponDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'coupon_name',
      title: "{{t('marketing.couponName')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'coupon_code',
      title: "{{t('marketing.couponCode')}}",
      width: 150,
      align: 'left',
      sortable: true,
    },
    {
      field: 'coupon_type',
      title: "{{t('marketing.couponType')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 优惠券类型列需要特殊处理，使用自定义渲染
      slots: { default: 'coupon_type' },
    },
    {
      field: 'discount_value',
      title: "{{t('marketing.discountValue')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 折扣值列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'minimum_amount',
      title: "{{t('marketing.minimumAmount')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 最低消费金额列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'usage_limit',
      title: "{{t('marketing.usageLimit')}}",
      width: 100,
      align: 'left',
      sortable: true,
      // 使用限制列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'used_count',
      title: "{{t('marketing.usedCount')}}",
      width: 100,
      align: 'left',
      sortable: true,
      // 已使用次数列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
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
      field: 'status',
      title: "{{t('marketing.status')}}",
      width: 100,
      align: 'left',
      sortable: true,
      // 状态列需要特殊处理，使用自定义渲染
      slots: { default: 'status' },
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
      coupon_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.couponName')}}",
          clearable: true,
        },
      },
      coupon_code: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.couponCode')}}",
          clearable: true,
        },
      },
      coupon_type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectCouponType')}}",
          clearable: true,
          options: [
            { label: "{{t('marketing.coupon_type_PERCENTAGE'), value: 'PERCENTAGE' },
            { label: "{{t('marketing.coupon_type_FIXED'), value: 'FIXED' },
            { label: "{{t('marketing.coupon_type_FREE_SHIPPING'), value: 'FREE_SHIPPING' },
            { label: "{{t('marketing.coupon_type_BUY_ONE_GET_ONE'), value: 'BUY_ONE_GET_ONE' },
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
          clearable: true,
          options: [
            { label: "{{t('marketing.status_ACTIVE'), value: 'ACTIVE' },
            { label: "{{t('marketing.status_INACTIVE'), value: 'INACTIVE' },
            { label: "{{t('marketing.status_EXPIRED'), value: 'EXPIRED' },
            { label: "{{t('marketing.status_USED_UP'), value: 'USED_UP' },
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
  const gridEvents: VxeGridListeners<MarketingCouponInfo> = {
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
  const gridOptions: VxeGridProps<MarketingCouponInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'coupon_name',
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
          return await marketingApi.getCouponList({
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






