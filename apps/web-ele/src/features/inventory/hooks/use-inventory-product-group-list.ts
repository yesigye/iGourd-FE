import { computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer } from '@igourd/common-ui';
import { inventoryApi } from '../apis';
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

// 定义产品分组数据类型
interface ProductGroupInfo {
  id: string;
  parent_id: string | null;
  major_name: string;
  minor_name: string;
  remark: string;
  merchant_id: string;
  creator_id: string;
  creator_name: string;
  create_time: string;
  update_time: string;
  add_type: number;
}

export function useInventoryProductGroupList() {
  const { t } = useI18n();
  
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: () => import('../components/inventory-product-group-drawer.vue'),
  });

  // 搜索表单配置
  const searchFormSchema = {
    type: 'object',
    properties: {
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
    },
  };

  // 表格列配置
  const columns = computed(() => [
    { title: "{{t('common.search')}}", type: 'seq', width: 80 },
    { align: 'left', title: 'Name', type: 'checkbox', width: 100 },
    {
      field: 'major_name',
      title: "{{t('inventory.majorGroup')}}",
      width: 200,
      fixed: 'left',
      showOverflow: 'tooltip',
    },
    {
      field: 'minor_name',
      title: "{{t('inventory.minorGroup')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'remark',
      title: "{{t('common.remark')}}",
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'creator_name',
      title: "{{t('common.creator')}}",
      width: 150,
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
      const response = await inventoryApi.getProductGroupList({
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
      console.error('获取产品分组列表失败:', error);
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
