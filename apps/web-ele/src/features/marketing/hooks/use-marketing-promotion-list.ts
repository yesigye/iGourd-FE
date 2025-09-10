import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { marketingApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import MarketingPromotionDrawerFrom from '../components/marketing-promotion-drawer.vue';

// 定义行数据类型 - 基于原有的表格数据结构
interface MarketingPromotionInfo {
  id: string;
  promotion_name: string;
  promotion_type: string;
  promotion_status: string;
  start_time: string;
  end_time: string;
  target_products: string;
  discount_value: number;
  minimum_quantity: number;
  maximum_quantity: number;
  creator_name: string;
  create_time: string;
}

export function useMarketingPromotionList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: MarketingPromotionDrawerFrom,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns = computed(() => [


    {
      field: 'promotion_name',
      title: "{{t('marketing.promotionName')}}",
      width: 200,
      align: 'left',
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'promotion_type',
      title: "{{t('marketing.promotionType')}}",
      width: 150,
      align: 'left',
      sortable: true,
      // 促销类型列需要特殊处理，使用自定义渲染
      slots: { default: 'promotion_type' },
    },
    {
      field: 'promotion_status',
      title: "{{t('marketing.promotionStatus')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 促销状态列需要特殊处理，使用自定义渲染
      slots: { default: 'promotion_status' },
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
      field: 'target_products',
      title: "{{t('marketing.targetProducts')}}",
      width: 200,
      align: 'left',
      sortable: true,
      // 目标商品列需要特殊处理，使用自定义渲染
      slots: { default: 'target_products' },
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
      field: 'minimum_quantity',
      title: "{{t('marketing.minimumQuantity')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 最小数量列需要格式化
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '0';
      },
    },
    {
      field: 'maximum_quantity',
      title: "{{t('marketing.maximumQuantity')}}",
      width: 120,
      align: 'left',
      sortable: true,
      // 最大数量列需要格式化
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
      promotion_name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Input',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.promotionName')}}",
          clearable: true,
        },
      },
      promotion_type: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectPromotionType')}}",
          clearable: true,
          options: [
            { label: "{{t('marketing.promotion_type_BUY_ONE_GET_ONE'), value: 'BUY_ONE_GET_ONE' },
            { label: "{{t('marketing.promotion_type_BUY_TWO_GET_ONE'), value: 'BUY_TWO_GET_ONE' },
            { label: "{{t('marketing.promotion_type_QUANTITY_DISCOUNT'), value: 'QUANTITY_DISCOUNT' },
            { label: "{{t('marketing.promotion_type_TIERED_DISCOUNT'), value: 'TIERED_DISCOUNT' },
            { label: "{{t('marketing.promotion_type_FREE_GIFT'), value: 'FREE_GIFT' },
          ],
        },
      },
      promotion_status: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-decorator-props': {
          gridSpan: 'span 2',
        },
        'x-component': 'Select',
        'x-class': 'w-full',
        'x-component-props': {
          placeholder: "{{t('marketing.pleaseSelectPromotionStatus')}}",
          clearable: true,
          options: [
            { label: "{{t('marketing.promotion_status_DRAFT'), value: 'DRAFT' },
            { label: "{{t('marketing.promotion_status_ACTIVE'), value: 'ACTIVE' },
            { label: "{{t('marketing.promotion_status_PAUSED'), value: 'PAUSED' },
            { label: "{{t('marketing.promotion_status_COMPLETED'), value: 'COMPLETED' },
            { label: "{{t('marketing.promotion_status_CANCELLED'), value: 'CANCELLED' },
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
  const gridEvents: VxeGridListeners<MarketingPromotionInfo> = {
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
  const gridOptions: VxeGridProps<MarketingPromotionInfo> = {
    checkboxConfig: {
      highlight: true,
      labelField: 'promotion_name',
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
          return await marketingApi.getPromotionList({
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






