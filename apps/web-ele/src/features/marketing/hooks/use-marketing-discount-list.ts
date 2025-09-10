import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { marketingApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import MarketingDiscountDrawer from '../components/marketing-discount-drawer.vue';

// 定义折扣数据类型
interface DiscountInfo {
  id: string;
  name: string;
  type: string;
  channel: string;
  minimum_amount: number;
  reduce_amount: number;
  discount_percentage: number;
  effective_time: string;
  expiration_time: string;
  creator_name: string;
  create_time: string;
  status: string;
}

export function useMarketingDiscountList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: MarketingDiscountDrawer,
  });

  // 搜索表单配置
  const searchFormSchema = {
    type: 'object',
    properties: {
      keywords: {
        type: 'string',
        title: "{{t('marketing.reductionKeywords')}}",
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: "{{t('marketing.reductionKeywords')}}",
          clearable: true,
        },
      },
    },
  };

  // 表格列配置
  const columns = computed(() => [


    {
      field: 'name',
      title: "{{t('marketing.promotionalname')}}",
      width: 250,
      fixed: 'left',
      showOverflow: 'tooltip',
    },
    {
      field: 'type',
      title: "{{t('marketing.promotiontype')}}",
      width: 180,
      slots: { default: 'type' },
    },
    {
      field: 'minimum_amount',
      title: "{{t('marketing.sumofconsumption')}}",
      width: 190,
      formatter: ({ cellValue }) => cellValue ? `¥${cellValue}` : '-',
    },
    {
      field: 'reduce_amount',
      title: "{{t('marketing.fulldeduction')}}",
      width: 180,
      formatter: ({ cellValue }) => cellValue ? `¥${cellValue}` : '-',
    },
    {
      field: 'discount_percentage',
      title: "{{t('marketing.discountPTG')}}",
      width: 180,
      formatter: ({ cellValue }) => cellValue ? `${cellValue}%` : '-',
    },
    {
      field: 'channel',
      title: "{{t('marketing.scopeofapplication')}}",
      width: 180,
      slots: { default: 'channel' },
    },
    {
      field: 'effective_time',
      title: "{{t('marketing.effectiveTime')}}",
      width: 180,
    },
    {
      field: 'expiration_time',
      title: "{{t('marketing.expirationTime')}}",
      width: 180,
    },
    {
      field: 'creator_name',
      title: "{{t('marketing.creator')}}",
      width: 200,
    },
    {
      field: 'create_time',
      title: "{{t('marketing.creationTime')}}",
      width: 180,
    },
    {
      field: 'status',
      title: "{{t('marketing.initiateMode')}}",
      width: 85,
      fixed: 'right',
      slots: { default: 'status' },
    },
    {
      field: 'action',
      title: "{{t('marketing.action')}}",
      width: 85,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ]);

  // 表格配置
  const gridOptions = computed<VxeGridProps>(() => ({
    columns: columns.value,
    data: [],
    height: 'auto',
    stripe: true,
    border: true,
    resizable: true,
    showOverflow: 'tooltip',
    rowKey: 'id',
    checkboxConfig: {
      highlight: true,
    },
  }));

  // 表格事件
  const gridEvents = computed<VxeGridListeners>(() => ({
    checkboxChange: ({ records }) => {
      // 处理选中行变化
      console.log('选中的行:', records);
    },
  }));

  // 获取列表数据
  const getList = async () => {
    try {
      const response = await marketingApi.getDiscountList({
        keywords: '',
        page_num: 1,
        page_size: 10,
        merchant_id: '',
      });
      if (response.code === 'SUCCESS') {
        // 处理时间格式
        const list = response.data.list.map(item => ({
          ...item,
          effective_time: item.effective_time?.split(' ')[0] || '',
          expiration_time: item.expiration_time?.split(' ')[0] || '',
        }));

        return {
          list,
          total: response.data.total,
        };
      }
      return { list: [], total: 0 };
    } catch (error) {
      console.error('获取折扣列表失败:', error);
      return { list: [], total: 0 };
    }
  };

  // 使用 VXE Grid
  const { Grid, gridApi } = useIgourdVxeGrid({
    gridOptions,
    gridEvents,
    formOptions: {
      schema: searchFormSchema,
    },
    getList,
  });

  return {
    Grid,
    Drawer,
    drawerApi,
    searchFormSchema,
  };
}
