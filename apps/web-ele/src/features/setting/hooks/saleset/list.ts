import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';

import type {
  SettingSalesetQueryPageVO,
  SettingSalesetPageModel,
  SalesetStatus,
  ProductSettings,
  SalesSettings,
  CashierSettings,
  InventorySettings,
} from '@@/setting/types';

import {
  getSettingSalesetPageListApi,
  deleteSettingSalesetApi,
  updateSalesetStatusApi,
} from '@@/setting/apis';

export function useSettingSaleset() {
  const { t } = useI18n();
  const userStore = useUserStore();
  // 基础列定义
  const baseColumns = [
    {
      prop: 'setting_name',
      width: 200,
      align: 'left',
      fixed: 'left',
      title: t('setting.settingName'),
    },
    {
      prop: 'setting_key',
      width: 150,
      align: 'left',
      title: t('setting.settingKey'),
    },
    {
      prop: 'setting_value',
      width: 200,
      align: 'left',
      title: t('setting.settingValue'),
    },
    {
      prop: 'setting_type',
      width: 120,
      align: 'center',
      title: t('setting.settingType'),
    },
    {
      prop: 'status',
      width: 100,
      align: 'center',
      title: t('setting.status'),
    },
    {
      prop: 'group_name',
      width: 150,
      align: 'left',
      title: t('setting.groupName'),
    },
    {
      prop: 'description',
      width: 200,
      align: 'left',
      title: t('setting.description'),
    },
    {
      prop: 'sort_order',
      width: 100,
      align: 'center',
      title: t('setting.sortOrder'),
    },
    {
      prop: 'creator_name',
      width: 120,
      align: 'left',
      title: t('setting.creatorName'),
    },
    {
      prop: 'create_time',
      width: 180,
      align: 'center',
      fixed: 'right',
      title: t('setting.createTime'),
    },
  ];
  // 查询参数
  const queryParams = ref<SettingSalesetQueryPageVO>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 选中的行数据
  const selectedRows = ref<SettingSalesetPageModel[]>([]);

  // 产品设置
  const productSettings = ref<ProductSettings>({
    use_product_specification_settings: false,
    product_specification_prompt: '',
  });

  // 销售设置
  const salesSettings = ref<SalesSettings>({
    is_less_zero_prohibited: false,
    when_prohibited_to_sell_it: '',
    is_price_modify_support: false,
    temporary_change_price_prompt: '',
    is_discount_support: false,
    discount_support_prompt: '',
    is_coupon_support: false,
    coupon_support_prompt: '',
    is_member_price_support: false,
    member_price_support_prompt: '',
    is_bulk_price_support: false,
    bulk_price_support_prompt: '',
    is_promotion_support: false,
    promotion_support_prompt: '',
  });

  // 收银设置
  const cashierSettings = ref<CashierSettings>({
    is_auto_print_receipt: false,
    auto_print_receipt_prompt: '',
    is_auto_print_label: false,
    auto_print_label_prompt: '',
    is_auto_calculate_tax: false,
    auto_calculate_tax_prompt: '',
    is_auto_round_amount: false,
    auto_round_amount_prompt: '',
    is_auto_save_customer: false,
    auto_save_customer_prompt: '',
    is_auto_save_transaction: false,
    auto_save_transaction_prompt: '',
  });

  // 库存设置
  const inventorySettings = ref<InventorySettings>({
    is_auto_deduct_inventory: false,
    auto_deduct_inventory_prompt: '',
    is_auto_update_cost: false,
    auto_update_cost_prompt: '',
    is_auto_update_price: false,
    auto_update_price_prompt: '',
    is_auto_update_spec: false,
    auto_update_spec_prompt: '',
    is_auto_update_category: false,
    auto_update_category_prompt: '',
    is_auto_update_brand: false,
    auto_update_brand_prompt: '',
  });

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: SettingSalesetQueryPageVO) => {
      const response = await getSettingSalesetPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除销售设置
    remove: async (data: {
      saleset_id_list: number[];
      merchant_id?: number;
    }) => {
      return await deleteSettingSalesetApi(data);
    },
  };

  // 使用 CRUD Hook
  const {
    Grid,
    gridApi,
    handleEdit,
    handleDelete,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,
  } = useCrud({
    service,
    columns: baseColumns,
    searchFormSchema: [
      {
        type: 'input',
        name: 'keywords',
        title: t('setting.search'),
        placeholder: t('setting.searchPlaceholder'),
      },
      {
        type: 'select',
        name: 'status',
        title: t('setting.status'),
        options: [
          { label: t('setting.status.active'), value: 'ACTIVE' },
          { label: t('setting.status.inactive'), value: 'INACTIVE' },
        ],
      },
      {
        type: 'select',
        name: 'group_name',
        title: t('setting.groupName'),
        options: [
          { label: t('setting.group.product'), value: 'product' },
          { label: t('setting.group.sales'), value: 'sales' },
          { label: t('setting.group.cashier'), value: 'cashier' },
          { label: t('setting.group.inventory'), value: 'inventory' },
        ],
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [SalesetDrawer, { openDrawer: openSalesetDrawer }] = useDrawer<{
    type: string;
    id?: number;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      keywords: val.searchVal?.keywords || '',
      status: val.searchVal?.status || undefined,
      group_name: val.searchVal?.group_name || undefined,
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: SettingSalesetPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openSalesetDrawer(true, { type: 'add' });
  };

  // 处理编辑
  const handleEditSaleset = (row: SettingSalesetPageModel) => {
    openSalesetDrawer(true, { type: 'edit', id: row.id });
  };

  // 处理详情
  const handleDetail = (row: SettingSalesetPageModel) => {
    openSalesetDrawer(true, { type: 'detail', id: row.id });
  };

  // 处理状态切换
  const handleToggleStatus = async (row: SettingSalesetPageModel) => {
    try {
      const newStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateSalesetStatusApi({
        saleset_id: row.id,
        status: newStatus,
        merchant_id: userStore.merchantId,
      });
      refresh();
    } catch (error) {
      console.error('切换状态失败:', error);
    }
  };

  // 处理产品设置开关变化
  const handleProductSpecChange = async (value: boolean) => {
    productSettings.value.use_product_specification_settings = value;
    // 这里可以调用API保存设置
    console.log('产品规格设置变化:', value);
  };

  // 处理销售设置开关变化
  const handleSalesSwitchChange = async (key: string, value: boolean) => {
    (salesSettings.value as any)[key] = value;
    // 这里可以调用API保存设置
    console.log('销售设置变化:', key, value);
  };

  // 处理收银设置开关变化
  const handleCashierSwitchChange = async (key: string, value: boolean) => {
    (cashierSettings.value as any)[key] = value;
    // 这里可以调用API保存设置
    console.log('收银设置变化:', key, value);
  };

  // 处理库存设置开关变化
  const handleInventorySwitchChange = async (key: string, value: boolean) => {
    (inventorySettings.value as any)[key] = value;
    // 这里可以调用API保存设置
    console.log('库存设置变化:', key, value);
  };

  // 处理批量删除
  const handleBatchDeleteSaleset = async () => {
    if (!selectedRows.value.length) return;

    try {
      await deleteSettingSalesetApi({
        merchant_id: userStore.merchantId,
        saleset_id_list: selectedRows.value.map((item) => item.id),
      });
      refresh();
      selectedRows.value = [];
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  // 页码改变
  const handleCurrentChange = (val: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_num: val,
    };
  };

  // 页面大小改变
  const handleSizeChange = (val: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_size: val,
    };
  };

  return {
    // 组件
    Grid,
    SalesetDrawer,

    // 数据
    queryParams,
    selectedRows,
    productSettings,
    salesSettings,
    cashierSettings,
    inventorySettings,

    // 配置
    columns: baseColumns,

    // 方法
    handleEdit,
    handleDelete,
    handleSearch,
    handleSelectionChange,
    handleAdd,
    handleEditSaleset,
    handleDetail,
    handleToggleStatus,
    handleProductSpecChange,
    handleSalesSwitchChange,
    handleCashierSwitchChange,
    handleInventorySwitchChange,
    handleBatchDeleteSaleset,
    handleCurrentChange,
    handleSizeChange,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,

    // API
    gridApi,
  };
}
