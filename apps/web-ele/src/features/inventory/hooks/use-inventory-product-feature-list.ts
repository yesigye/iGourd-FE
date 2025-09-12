import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps, VxeGridPropTypes } from '#/adapter/vxe-table';
import ProductFeatureDrawer from '../components/inventory-product-feature-drawer.vue';

// 定义产品特性数据类型
interface ProductFeatureInfo {
  id: string;
  entity: string;
  name: string;
  is_compulsory: boolean;
  is_fixed_option: boolean | null;
  type: string;
  options: string;
  max_length: number;
  remark: string;
  merchant_id: string;
  selectionOptions: Array<{ name: string }>;
}

export function useInventoryProductFeatureList() {
  const { t } = useI18n();

  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: ProductFeatureDrawer,
  });

  // 搜索表单配置
  const searchFormSchema = {
    keywords: {
      type: 'string',
      title: "{{t('purchase.placeholder')}}",
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('purchase.placeholder')}}",
        clearable: true,
      },
    },
  };

  // 表格列配置
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      field: 'name',
      title: "{{t('customers.featureName')}}",
      width: 200,
      fixed: 'left',
      showOverflow: 'tooltip',
    },
    {
      field: 'type',
      title: "{{t('purchase.featureType')}}",
      width: 150,
      slots: { default: 'type' },
    },
    {
      field: 'is_compulsory',
      title: "{{t('purchase.isCompulsory')}}",
      width: 120,
      slots: { default: 'is_compulsory' },
    },
    {
      field: 'is_fixed_option',
      title: "{{t('purchase.isFixedOption')}}",
      width: 150,
      slots: { default: 'is_fixed_option' },
    },
    {
      field: 'max_length',
      title: "{{t('purchase.maxLength')}}",
      width: 120,
    },
    {
      field: 'remark',
      title: "{{t('common.remark')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'create_time',
      title: "{{t('common.createTime')}}",
      width: 180,
    },
    {
      field: 'action',
      title: "{{t('common.action')}}",
      width: 120,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];

  // 表格配置
  const gridOptions: VxeGridProps<any> = {
    columns: columns,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await purchaseApi.getProductFeatureList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: '1938848394566025217',
            ...form,
          });
        },
      },
    },
  };

  // 表格事件
  const gridEvents = computed<VxeGridListeners>(() => ({}));

  // 获取列表数据
  const getList = async () => {
    try {
      const response = await inventoryApi.getProductFeatureList({
        keywords: '',
        page_num: 1,
        page_size: 10,
        merchant_id: '',
      });
      if (response.code === 'SUCCESS') {
        return {
          list: response.data.list || [],
          total: response.data.total || 0,
        };
      }
      return { list: [], total: 0 };
    } catch (error) {
      console.error('获取产品特性列表失败:', error);
      return { list: [], total: 0 };
    }
  };

  // 检查是否达到最大数量限制
  const isMaxItems = ref(false);

  // 使用 VXE Grid
  const [Grid, gridApi] = useIgourdVxeGrid({
    formOptions: { schema: searchFormSchema },
    gridEvents,
    gridOptions,
  });

  return {
    Grid,
    Drawer,
    gridApi,
    drawerApi,
    searchFormSchema,
    isMaxItems,
  };
}
