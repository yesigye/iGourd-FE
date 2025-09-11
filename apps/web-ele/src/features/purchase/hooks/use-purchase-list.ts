import { computed, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdVxeGrid } from '#/adapter/vxe-table';
import { useIgourdDrawer, confirm } from '@igourd/common-ui';
import { batchDeleteVendorApi, purchaseApi } from '../apis';
import type {
  VxeGridListeners,
  VxeGridProps,
  VxeGridPropTypes,
} from '#/adapter/vxe-table';
import PurchaseDrawerFrom from '../components/purchase-drawer.vue';
import { useUserStore } from '@igourd/stores';

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
  const checkedKeys = ref<number[]>([]);
  // 获取抽屉组件
  const [Drawer, drawerApi] = useIgourdDrawer({
    connectedComponent: PurchaseDrawerFrom,
  });
  const { currentLoginUserApp } = useUserStore();
  // 表格列配置 - 基于原有的 columnsVisible 数组
  const columns: VxeGridPropTypes.Column<any>[] = [
    {
      type: 'checkbox',
      width: 80,
    },
    {
      field: 'name',
      title: t('purchase.featureName'),
      minWidth: 170,
      sortable: true,
      align: 'left',
    },
    {
      cellRender: { name: 'CellImage' },
      field: 'profile_photo',
      title: t('purchase.profilePhoto'),
      width: 80,
      align: 'center',
    },
    {
      field: 'name',
      title: t('purchase.vendorName'),
      width: 155,
      sortable: true,
    },
    {
      field: 'contact_name',
      title: t('purchase.name'),
      width: 160,
      sortable: true,
    },
    {
      field: 'contact_telephone',
      title: t('purchase.contactTelephone'),
      width: 200,
      sortable: true,
    },
    {
      field: 'address',
      title: t('purchase.address'),
      width: 200,
      sortable: true,
    },
    {
      field: 'creator_name',
      title: t('purchase.creator'),
      width: 200,
      sortable: true,
      align: 'left',
    },
    {
      field: 'create_time',
      title: t('purchase.createTime'),
      width: 180,
      sortable: true,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: t('purchase.operation'),
      sortable: true,
      minWidth: 180,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ];

  // 搜索表单配置 - 基于原有的 queryParams 对象
  const searchFormSchema = {
    keywords: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-class': 'w-full',
      'x-component-props': {
        placeholder: "{{t('common.keywords')}}",
        clearable: true,
      },
    },
  };

  // Grid 事件配置
  const gridEvents: VxeGridListeners<any> = {
    checkboxChange(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
    checkboxAll(params) {
      checkedKeys.value = params.records.map((item) => item.id);
    },
  };

  // Grid 选项配置
  const gridOptions: VxeGridProps<PurchaseInfo> = {
    checkboxConfig: {
      highlight: true,
    },
    columns: columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, form = {}) => {
          return await purchaseApi.getPageList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            merchant_id: currentLoginUserApp.owner_id,
            ...form,
          });
        },
      },
    },
  };
  const canBatchDelete = computed(() => checkedKeys.value.length > 0);
  function batchDelete() {
    confirm({
      title: t('purchase.deleteConfirmTitle'),
      content: t('purchase.deleteConfirmText'),
    })
      .then(() => {
        return batchDeleteVendorApi({
          vendor_id_list: checkedKeys.value,
          merchant_id: currentLoginUserApp.owner_id,
        });
      })
      .then(() => {
        gridApi.reload();
        checkedKeys.value = [];
      });
  }
  // 使用 useIgourdVxeGrid
  const [Grid, gridApi] = useIgourdVxeGrid({
    gridEvents,
    gridOptions,
    formOptions: { schema: searchFormSchema, scope: {} },
  });
  async function handleEdit(row: any) {
    drawerApi.setData(row).open();
  }
  return {
    // 组件
    Grid,
    Drawer,
    gridApi,
    drawerApi,
    batchDelete,
    handleEdit,
    canBatchDelete,
  };
}
