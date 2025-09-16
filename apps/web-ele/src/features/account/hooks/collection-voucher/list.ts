import { ref, computed } from 'vue';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';
import { useCrud } from '#/hooks';
import { useIgourdDrawer as useDrawer } from '@igourd/common-ui';
import { formatRangeTime } from '@igourd/utils';

import type {
  CollectionVoucherQueryParams,
  CollectionVoucherSearchParams,
  CollectionVoucherDrawerType,
  ReceiptOrderPageModel,
  ReviewStatusEnum,
} from '@@/account/types';

import {
  getReceiptOrderPageListApi,
  removeReceiptOrderApi,
  modifyReceiptOrderStatusApi,
} from '@@/account/apis';

export function useCollectionVoucher() {
  const { t } = useI18n();
  const userStore = useUserStore();

  // 基础列定义
  const baseColumns = [
    {
      prop: 'receipt_order_no',
      width: 190,
      title: t('account.receipt_order_no'),
      filterAble: true,
    },
    {
      prop: 'customer_name',
      width: 190,
      title: t('printTemp.printReceipt.receipt_customer_name'),
      filterAble: true,
    },
    {
      prop: 'receipt_time',
      width: 170,
      title: t('sales.orderDate'),
      filterAble: true,
    },
    {
      prop: 'total_amount',
      width: 150,
      title: t('customers.collected_amt'),
    },
    {
      prop: 'receipt_direction',
      width: 140,
      title: t('customers.order_dir'),
    },
    {
      prop: 'business_type',
      width: 140,
      title: t('settings.businessType'),
    },
    {
      prop: 'ledger_type',
      width: 130,
      title: t('account.accountType'),
    },
    {
      prop: 'remark',
      width: 150,
      title: t('customers.remarks'),
    },
    {
      prop: 'review_time',
      width: 170,
      title: t('customers.review_time'),
      filterAble: true,
    },
    {
      prop: 'reviewer_name',
      width: 110,
      title: t('inventory.reviewer'),
      filterAble: true,
    },
    {
      prop: 'review_status',
      width: 130,
      title: t('common.review'),
      filterAble: true,
      fixed: 'right',
    },
  ];

  // 查询参数
  const queryParams = ref<CollectionVoucherQueryParams>({
    page_num: 1,
    page_size: 10,
    keywords: '',
    merchant_id: userStore.merchantId,
  });

  // 搜索参数
  const searchParams = ref<CollectionVoucherSearchParams>({
    keywords: '',
  });

  // 选中的行数据
  const selectedRows = ref<ReceiptOrderPageModel[]>([]);

  // 服务函数
  const service = {
    // 获取列表数据
    query: async (params: CollectionVoucherQueryParams) => {
      const response = await getReceiptOrderPageListApi(params);
      return {
        data: response.data?.list || [],
        total: response.data?.total || 0,
      };
    },

    // 删除收款单
    remove: async (data: {
      receipt_order_ids: number[];
      merchant_id?: number;
    }) => {
      return await removeReceiptOrderApi(data);
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
        title: t('account.enter_receipt_order_no'),
        placeholder: t('account.enter_receipt_order_no'),
      },
    ],
    batchOperate: true, // 支持批量删除
    connectedComponent: false,
  });

  // 抽屉管理
  const [Drawer, { openDrawer }] = useDrawer<CollectionVoucherDrawerType>();
  const [DetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer<{
    id: string;
  }>();

  // 处理搜索
  const handleSearch = (val: any) => {
    queryParams.value = {
      ...queryParams.value,
      ...val.cellSearch,
      receipt_start_time: val.cellSearch?.receipt_start_time
        ? formatRangeTime(val.cellSearch?.receipt_start_time)
        : undefined,
      receipt_end_time: val.cellSearch?.receipt_start_time
        ? formatRangeTime(val.cellSearch?.receipt_start_time, 'end')
        : undefined,
      review_start_time: val.cellSearch?.review_start_time
        ? formatRangeTime(val.cellSearch?.review_start_time)
        : undefined,
      review_end_time: val.cellSearch?.review_start_time
        ? formatRangeTime(val.cellSearch?.review_start_time, 'end')
        : undefined,
      keywords: val.searchVal?.keywords || '',
      page_num: 1,
    };
  };

  // 处理选择
  const handleSelectionChange = (rows: ReceiptOrderPageModel[]) => {
    selectedRows.value = rows;
  };

  // 处理添加
  const handleAdd = () => {
    openDrawer(true, {
      type: 'add',
    });
  };

  // 处理编辑
  const handleEditCollectionVoucher = (row: ReceiptOrderPageModel) => {
    openDrawer(true, {
      type: 'edit',
      id: row.id,
      businessType: row.business_type,
    });
  };

  // 处理详情
  const handleDetail = (row: ReceiptOrderPageModel) => {
    openDetailDrawer(true, { id: row.id });
  };

  // 处理打印
  const handlePrint = async (row: ReceiptOrderPageModel) => {
    // 这里应该实现打印逻辑
    console.log('打印收款单:', row);
  };

  // 处理批量删除
  const handleBatchDeleteCollectionVoucher = async () => {
    if (!selectedRows.value.length) return;

    try {
      await removeReceiptOrderApi({
        receipt_order_ids: selectedRows.value.map((item) => item.id),
        merchant_id: userStore.merchantId,
      });
      refresh();
      selectedRows.value = [];
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  // 修改收款单状态
  const handleModifyStatus = async (
    row: ReceiptOrderPageModel,
    status: ReviewStatusEnum,
  ) => {
    try {
      await modifyReceiptOrderStatusApi({
        merchant_id: userStore.merchantId,
        receipt_order_id: row.id,
        review_status: status,
      });
      refresh();
    } catch (error) {
      console.error('修改状态失败:', error);
    }
  };

  // 页码改变
  const handlePageChange = (page: number, size: number) => {
    queryParams.value = {
      ...queryParams.value,
      page_num: page,
      page_size: size,
    };
  };

  return {
    // 组件
    Grid,
    Drawer,
    DetailDrawer,

    // 数据
    queryParams,
    searchParams,
    selectedRows,

    // 配置
    columns: baseColumns,

    // 方法
    handleEdit,
    handleDelete,
    handleSearch,
    handleSelectionChange,
    handleAdd,
    handleEditCollectionVoucher,
    handleDetail,
    handlePrint,
    handleBatchDeleteCollectionVoucher,
    handleModifyStatus,
    handlePageChange,
    canBatchOperate,
    handleBatchDelete,
    refresh,
    loading,

    // API
    gridApi,
  };
}
