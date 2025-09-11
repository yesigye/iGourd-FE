import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, confirm } from '@igourd/common-ui';
import { deleteDynamicColumn, getPurchaseCustomizedListApi } from '../apis';
import type {
  VxeGridListeners,
  VxeGridProps,
  VxeGridPropTypes,
} from '#/adapter/vxe-table';
import PurchaseCustomizedDrawerFrom from '../components/purchase-customized-drawer.vue';
import { useUserStore } from '@igourd/stores';

// 定义行数据类型 - 基于原有的表格数据结构
interface PurchaseCustomizedInfo {
  id: number;
  name: string;
  type: string;
  is_fixed_option: boolean;
  is_compulsory: boolean;
  creator_name: string;
  create_time: string;
}

export function usePurchaseCustomizedList() {
  const { t } = useI18n();
  const { currentLoginUserApp } = useUserStore();
  const checkedKeys = ref<number[]>([]);
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseCustomizedDrawerFrom,
    appendToMain: true,
  });

  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns: VxeGridPropTypes.Column<PurchaseCustomizedInfo>[] = [
    {
      type: 'checkbox',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'name',
      title: t('purchase.featureName'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      field: 'type',
      title: t('purchase.featureType'),
      minWidth: 120,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue === 'SELECT') return t('purchase.select');
        return t('purchase.input');
      },
    },
    {
      field: 'is_fixed_option',
      title: t('purchase.selectionType'),
      minWidth: 200,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue) return t('purchase.fixed');
        return t('purchase.userCreated');
      },
    },
    {
      field: 'is_compulsory',
      title: t('purchase.compulsory'),
      minWidth: 150,
      sortable: true,
      align: 'left',
      formatter: ({ cellValue }) => {
        if (cellValue) return t('purchase.yes');
        return t('purchase.no');
      },
    },
    {
      field: 'creator_name',
      title: t('purchase.creator'),
      minWidth: 180,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('purchase.creationTime'),
      sortable: true,
      align: 'left',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('purchase.operation'),
      sortable: true,
      minWidth: 180,
      slots: { default: 'operation' },
      formatter: 'formatDateTime',
    },
  ];

  // 搜索表单配置 - 基于原有的 queryParams 对象
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<PurchaseCustomizedInfo> = {
    checkboxChange(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
    checkboxAll(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<PurchaseCustomizedInfo> = {
    columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await getPurchaseCustomizedListApi({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: currentLoginUserApp.owner_id,
            entity: 'VENDOR',
            ...form,
          });
        },
      },
    },
  };

  // 使用 useIgourdVxeGrid
  const [Grid, gridApi] = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
    formOptions: { schema: searchFormSchema, scope: {} },
  });
  async function handleEdit(row: PurchaseCustomizedInfo) {
    drawerApi.setData(row).open();
  }
  const canBatchDelete = computed(() => checkedKeys.value.length > 0);
  function batchDelete() {
    confirm({
      title: t('purchase.deleteConfirmTitle'),
      content: t('purchase.deleteConfirmText'),
    })
      .then(() => {
        return deleteDynamicColumn({
          dynamic_column_id_list: checkedKeys.value,
          merchant_id: currentLoginUserApp.owner_id,
        });
      })
      .then(() => {
        gridApi.reload();
        checkedKeys.value = [];
      });
  }
  return {
    // 组件
    Grid,
    Drawer,
    gridApi,
    drawerApi,
    handleEdit,
    // 配置
    columns,
    searchFormSchema,
    gridEvents,
    gridOptions,
    canBatchDelete,
    batchDelete,
  };
}
