import { reactive, ref } from 'vue';
import { useI18n } from '@igourd/locales';
import { useIgourdDrawer } from '@igourd/common-ui';
import { customerApi } from '../apis';
import { debounce } from 'lodash-es';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import useUserStore from '@igourd/stores/useUserStore';

export function useConversionProducts() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const { merchantInfo } = storeToRefs(userStore);
  const merchant_id = merchantInfo.value.merchant_id;

  const receiptTableData = ref([]);
  const total = ref(0);
  const selectedRows = ref([]);
  const tableRef = ref();

  let points = reactive({
    costPoints: 0,
    restePoints: 0,
  });

  let currentRow = ref();

  // 表格查询参数
  const params = reactive({
    customer_id: 0,
    keywords: '',
    merchant_id: merchant_id,
    page_num: 1,
    page_size: 10,
    product_barcode: '',
    product_code: '',
    product_name: '',
  });

  // 积分保存参数
  let pointsCostParams = reactive({
    customer_id: 0,
    deduction_points: 0,
    merchant_id: merchant_id,
    point_gifts: [
      {
        product_barcode: '',
        product_code: '',
        product_id: 0,
        product_name: '',
        product_quantity: 0,
      },
    ],
  });

  const columnsClearing = [
    {
      prop: 'major_name',
      label: 'Product Name',
      width: '200',
      align: 'left',
    },
    {
      prop: 'product_code',
      label: 'product_code',
      'min-width': '150',
      align: 'left',
    },
    {
      prop: 'product_unit_name',
      label: 'product_unit_name',
      'min-width': '100',
      align: 'left',
    },
    {
      prop: 'sku_barcode',
      label: 'sku_barcode',
      'min-width': '150',
      align: 'left',
    },
    {
      prop: 'points',
      label: 'Point',
      'min-width': '150',
      align: 'left',
    },
    {
      prop: 'cost_price',
      label: 'Price',
      'min-width': '100',
      align: 'left',
    },
  ];

  // 重置
  const resetPoint = () => {
    points.costPoints = 0;
    points.restePoints = 0;
    closeDrawer();
  };

  const showWarningMessage = debounce(() => {
    ElMessage.warning(t('customers.exceedAvailablePoints'));
  }, 300);

  const getPointsList = async (params: any) => {
    const res = await CustomerService.getPointsDetailList(params);
    if (res.code == 'SUCCESS') {
      receiptTableData.value = res.data.list.map((item: any) => ({
        ...item,
        product_quantity: 0,
      }));
      total.value = parseInt(res.data.total) || 0;
    }
  };

  // 已选中的商品
  const handleSelectionChange = (selection: any[]) => {
    const totalAvailablePoints = Number(currentRow.value?.points || 0);
    let accumulatedPoints = 0;
    let validSelection: any[] = [];
    let isFullSelection = selection.length === receiptTableData.value.length;

    // 重置未选中项的数量
    receiptTableData.value.forEach((item: any) => {
      if (!selection.some((selected: any) => selected.id === item.id)) {
        item.product_quantity = 0;
      }
    });

    // 计算选中项积分
    for (const item of selection) {
      const itemPoints = Number(item.points || 0);

      if (!isRowSelected(item) && item.product_quantity === 0) {
        if (accumulatedPoints + itemPoints <= totalAvailablePoints) {
          item.product_quantity = 1;
          accumulatedPoints += itemPoints;
          validSelection.push(item);
        } else {
          tableRef.value?.toggleRowSelection(item, false);
          if (isFullSelection) {
            showWarningMessage(t('customers.pointPropmt'));
          }
          continue;
        }
      } else {
        const currentPoints = itemPoints * Number(item.product_quantity || 0);
        accumulatedPoints += currentPoints;
        validSelection.push(item);
      }
    }

    // 更新状态
    points.costPoints = accumulatedPoints;
    points.restePoints = totalAvailablePoints - accumulatedPoints;
    selectedRows.value = validSelection;

    updatePointGifts();
  };

  // 添加检查是否达到最大数量的函数
  const isMaxQuantity = (row: any) => {
    const totalAvailablePoints = Number(currentRow.value?.points || 0);
    let accumulatedPoints = 0;

    selectedRows.value.forEach((item: any) => {
      if (item.id !== row.id) {
        accumulatedPoints +=
          Number(item.points || 0) * Number(item.product_quantity || 0);
      }
    });

    // 当前行已使用的积分
    const currentRowPoints =
      Number(row.points || 0) * Number(row.product_quantity || 0);

    return accumulatedPoints + currentRowPoints >= totalAvailablePoints;
  };

  // 添加检查选中状态的辅助函数
  const isRowSelected = (row: any) => {
    return selectedRows.value.some((item: any) => item.id === row.id);
  };

  // 输入数量
  const handleInputDebounced = debounce((row: any) => {
    const totalAvailablePoints = Number(currentRow.value?.points || 0);

    if (row.product_quantity < 0) {
      row.product_quantity = 0;
    }

    // 计算已选中的商品的总积分
    let accumulatedPoints = 0;
    selectedRows.value.forEach((item: any) => {
      if (item.id !== row.id) {
        const itemPoints = Number(item.points || 0);
        const quantity = Number(item.product_quantity || 0);
        accumulatedPoints += itemPoints * quantity;
      }
    });

    const maxAllowedPoints = totalAvailablePoints - accumulatedPoints;
    const currentRowPoints = Number(row.points || 0);
    const maxQuantity = Math.floor(maxAllowedPoints / currentRowPoints);

    if (Number(row.product_quantity) > maxQuantity) {
      row.product_quantity = maxQuantity;
    } else {
      row.product_quantity = Math.floor(Number(row.product_quantity) || 0);
    }

    // 更新选中状态
    if (row.product_quantity > 0) {
      if (!isRowSelected(row)) {
        tableRef.value?.toggleRowSelection(row, true);
      }
    } else {
      if (isRowSelected(row)) {
        tableRef.value?.toggleRowSelection(row, false);
      }
    }

    // 重新计算总积分
    const newTotalPoints =
      accumulatedPoints + currentRowPoints * row.product_quantity;
    points.costPoints = newTotalPoints;
    points.restePoints = totalAvailablePoints - newTotalPoints;

    updatePointGifts();
  }, 300);

  // 更新积分兑换参数
  const updatePointGifts = () => {
    pointsCostParams.point_gifts = selectedRows.value
      .filter((item: any) => item.product_quantity > 0)
      .map((item: any) => ({
        product_barcode: item.product_barcode || '',
        product_code: item.product_code || '',
        product_id: item.id || 0,
        product_name: item.major_name || '',
        product_quantity: item.product_quantity,
      }));
  };

  const handleSizeChange = (val: number) => {
    params.page_size = val;
    getPointsList(params);
  };

  const handleCurrentChange = (val: number) => {
    params.page_num = val;
    getPointsList(params);
  };

  const handleSearch = () => {
    params.page_num = 1;
    getPointsList(params);
  };

  const submitExchangeGifts = async () => {
    if (pointsCostParams.point_gifts.length === 0) {
      ElMessage.warning(t('customers.selectAtLeastOne'));
      return;
    }

    pointsCostParams.deduction_points = points.costPoints;

    try {
      const res = await CustomerService.exchangePoints(pointsCostParams);
      if (res.code === 'SUCCESS') {
        ElMessage.success(t('customers.exchangeSuccess'));
        resetPoint();
      }
    } catch (error) {
      ElMessage.error(t('customers.exchangeFailed'));
    }
  };

  const [Drawer, drawerApi] = useIgourdDrawer({
    title: t('customers.exchangeGift'),
    class: 'w-750',
    onOpenChange(isOpen) {
      if (isOpen) {
        const data = drawerApi.getData();
        if (data) {
          currentRow.value = data;
          points.restePoints = data.points;
          params.customer_id = data.id;
          params.merchant_id = merchant_id;
          pointsCostParams.customer_id = data.id;
          pointsCostParams.merchant_id = merchant_id;
          getPointsList(params);
        }
      } else {
        resetPoint();
      }
    },
  });

  const openDrawer = (data: any) => {
    drawerApi.setData(data).open();
  };

  const closeDrawer = () => {
    drawerApi.close();
  };

  return {
    Drawer,
    drawerApi,
    openDrawer,
    closeDrawer,
    receiptTableData,
    total,
    selectedRows,
    tableRef,
    points,
    currentRow,
    params,
    columnsClearing,
    handleSelectionChange,
    isMaxQuantity,
    handleInputDebounced,
    handleSizeChange,
    handleCurrentChange,
    handleSearch,
    submitExchangeGifts,
  };
}
