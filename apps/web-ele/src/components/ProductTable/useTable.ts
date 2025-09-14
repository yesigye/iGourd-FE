import { ref, computed } from 'vue';
import { debounce } from '@igourd/utils';
import { InventoryService } from '@@/purchase/apis';
import { getDefaultProductItem } from './product.config';
import { ElMessage } from 'element-plus';
import { useI18n } from '@igourd/locales';
//@ts-ignore
import type { SpanMethodProps } from 'element-plus';

export const useProductTable = (
  externalData?: any[],
  type: string = 'default',
  initialWarehouseId?: string | number,
) => {
  const { t } = useI18n();
  const productSelectList = ref<any[]>(externalData ? externalData : []);
  const isUsingExternalData = ref(!!externalData);
  const currentWarehouseId = ref(initialWarehouseId);

  const skuParams = ref({
    business_type: ['receipt', 'purchase', 'return'].includes(type)
      ? 'PURCHASE'
      : 'OTHER',
    keywords: '',
    page_num: 1,
    page_size: 10,
    status: 'ON_SALE',
  });

  const warehouseParams = ref({
    warehouse_id: currentWarehouseId.value,
    keywords: '',
    page_num: 1,
    page_size: 10,
    status: 'ON_SALE',
  });

  const shouldUseWarehouseAPI = computed(() => {
    return (
      ['transfer', 'spoilage', 'physical'].includes(type) &&
      currentWarehouseId.value
    );
  });

  const getSkuProductList = async (forceRefresh = false) => {
    if (isUsingExternalData.value && !forceRefresh) return;

    if (shouldUseWarehouseAPI.value) {
      warehouseParams.value.warehouse_id = currentWarehouseId.value;
      try {
        const res = await InventoryService.warehouseProductPageList(
          warehouseParams.value,
        );
        if (res?.data?.list) {
          productSelectList.value = res.data.list;
        }
      } catch (error) {
        console.error('Failed to fetch warehouse products:', error);
        productSelectList.value = [];
      }
    } else {
      try {
        const res = await InventoryService.productSearch(skuParams.value);
        productSelectList.value = res.data?.list || [];
      } catch (error) {
        console.error('Failed to fetch products:', error);
        productSelectList.value = [];
      }
    }
  };

  const updateWarehouseId = (newWarehouseId?: string | number) => {
    if (newWarehouseId !== currentWarehouseId.value) {
      currentWarehouseId.value = newWarehouseId;
      warehouseParams.value.warehouse_id = newWarehouseId;

      if (
        newWarehouseId &&
        ['transfer', 'spoilage', 'physical'].includes(type)
      ) {
        getSkuProductList(true);
      }
    }
  };

  const filterProductSku = debounce((query: string) => {
    if (!query.trim() && productSelectList.value.length > 0) return;

    if (shouldUseWarehouseAPI.value) {
      warehouseParams.value.keywords = query;
    } else {
      skuParams.value.keywords = query;
    }

    getSkuProductList();
  }, 300);

  const safeParseFloat = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value) || 0;
  };

  const calculateTax = (baseAmount: number, taxConfig?: any): number => {
    if (!taxConfig) return 0;

    try {
      switch (taxConfig.calculation_type) {
        case 'PERCENTAGE':
          return baseAmount * (safeParseFloat(taxConfig.percentage || 0) / 100);
        case 'FIXED_PER_UNIT':
          return safeParseFloat(taxConfig.tax_amount || 0);
        default:
          return 0;
      }
    } catch (error) {
      console.error('Tax calculation error:', error);
      return 0;
    }
  };

  // 扫码
  const handleBarcodeScan = (
    scanData: any,
    productList: any[],
    callbacks: {
      onProductAdd: Function;
      onProductChange: Function;
      onQuantityChange: Function;
    },
  ) => {
    if (scanData && scanData.product) {
      const products = Array.isArray(scanData.product)
        ? scanData.product
        : [scanData.product];
      const defaultQuantity = scanData.quantity || 0;

      const existingProductIds = productList
        .filter((item) => item.product_id)
        .map((item) => item.product_id);
      const duplicateProducts = products.filter((product) =>
        existingProductIds.includes(product.id),
      );

      const newItems = products.map((scannedProduct) => {
        // 添加商品到选择列表
        if (
          !productSelectList.value.some(
            (item) => item.product_code === scannedProduct.product_code,
          )
        ) {
          productSelectList.value.push(scannedProduct);
        }

        const newItem = getDefaultProductItem();

        const availableStock =
          scannedProduct.sale_warehouse_product_stock_quantity || 0;

        Object.assign(newItem, {
          product_id: scannedProduct.id,
          major_name: scannedProduct.major_name,
          product_name: `${scannedProduct.major_name}${scannedProduct.product_spec_kvmessage ? '-' + scannedProduct.product_spec_kvmessage : ''}`,
          display_major_name: `${scannedProduct.major_name}${scannedProduct.product_spec_kvmessage ? '-' + scannedProduct.product_spec_kvmessage : ''}`,
          product_code: scannedProduct.product_code,
          product_unit_code: scannedProduct.product_unit_code,
          product_unit_name: scannedProduct.product_unit_name,
          major_unit_name: scannedProduct.major_unit_name,
          cost_price: scannedProduct.cost_price,
          basic_unit_radio: scannedProduct.basic_unit_radio,
          sub_product_stock_search_models:
            scannedProduct.sub_product_stock_search_models,
          profile_photo: scannedProduct.profile_photo,
          product_barcode: scannedProduct.product_barcode,
          product_spec_kvmessage: scannedProduct.product_spec_kvmessage,
          basic_unit_name: scannedProduct.major_unit_name,
          sku_group_code: scannedProduct.sku_group_code,
          basic_product_id: scannedProduct.basic_product_id,
          merchant_id: scannedProduct.merchant_id,
          product_unit_id: scannedProduct.product_unit_id,
          product_profile_id: scannedProduct.product_profile_id,
          basic_unit_id: scannedProduct.major_unit_id,
          other_tax_amount: scannedProduct.other_tax?.tax_amount || 0,
          vat_amount: scannedProduct.vat_tax?.tax_amount || 0,
          vat_tax: scannedProduct.vat_tax,
          other_tax: scannedProduct.other_tax,

          selling_price: scannedProduct.selling_price,
          id: scannedProduct.id,
          create_time: scannedProduct.create_time,
          modify_time: scannedProduct.modify_time,
          time_zone: scannedProduct.time_zone,
          version: scannedProduct.version,
          creator_id: scannedProduct.creator_id,
          remark: scannedProduct.remark,
          minor_name: scannedProduct.minor_name,
          stock_total_quantity: scannedProduct.stock_total_quantity,

          stock_total_quantity_message:
            scannedProduct.stock_total_quantity_message,
          purchase_unit_id: scannedProduct.purchase_unit_id,
          sale_unit_id: scannedProduct.sale_unit_id,
          product_group_id: scannedProduct.product_group_id,
          is_enabled_multi_unit: scannedProduct.is_enabled_multi_unit,
          product_profile_unit_radio_list:
            scannedProduct.product_profile_unit_radio_list,
          excise_tax: scannedProduct.excise_tax,
          tax_vat_id: scannedProduct.tax_vat_id,
          tax_excise_id: scannedProduct.tax_excise_id,
          tax_other_id: scannedProduct.tax_other_id,
          sale_warehouse_id: scannedProduct.sale_warehouse_id,
          sale_warehouse_name: scannedProduct.sale_warehouse_name,
          sale_warehouse_product_stock_quantity:
            scannedProduct.sale_warehouse_product_stock_quantity,
          sale_warehouse_product_stock_quantity_message:
            scannedProduct.sale_warehouse_product_stock_quantity_message,
          spec_code: scannedProduct.spec_code,
          sku_barcode: scannedProduct.sku_barcode,
          product_spec_kv: scannedProduct.product_spec_kv,
          major_unit_id: scannedProduct.major_unit_id,
        });

        if (type === 'receipt') {
          newItem.received_quantity = defaultQuantity;
        } else if (type === 'transfer') {
          newItem.product_cost_price = scannedProduct.cost_price;
          newItem.stock_quantity = scannedProduct.stock_total_quantity;

          const validQuantity = Math.min(defaultQuantity, availableStock);
          newItem.transfer_quantity = validQuantity;
          newItem.quantity = '';
          newItem.remaining_quantity = (
            validQuantity +
            validQuantity * safeParseFloat(scannedProduct.basic_unit_radio || 0)
          ).toFixed(0);

          newItem.transfer_amount = (
            validQuantity * safeParseFloat(scannedProduct.cost_price || 0)
          ).toFixed(2);
        } else if (type === 'physical') {
          const validQuantity = Math.min(defaultQuantity, availableStock);
          newItem.physical_quantity = validQuantity;
          newItem.origin_quantity = scannedProduct.stock_total_quantity;
          newItem.quantity = validQuantity;
        } else if (type === 'spoilage') {
          const validQuantity = Math.min(defaultQuantity, availableStock);
          newItem.consumption_quantity = validQuantity;
          newItem.product_cost_price = scannedProduct.cost_price;
        } else if (type === 'stock') {
          newItem.stock_add_quantity = defaultQuantity;
        } else {
          newItem.enter_quantity = defaultQuantity;
          newItem.quantity = defaultQuantity;
        }

        return newItem;
      });

      if (newItems.length === 0) {
        return null; // No new items to add
      }

      const updatedList = [...productList];
      if (
        productList.length > 0 &&
        !productList[productList.length - 1].product_code
      ) {
        updatedList.pop();
      }

      updatedList.push(...newItems);

      callbacks.onProductAdd(updatedList);

      newItems.forEach((item) => {
        if (type === 'physical') {
          callbacks.onQuantityChange(item.physical_quantity, item);
        } else if (type === 'receipt') {
          callbacks.onQuantityChange(item.received_quantity, item);
        } else if (type === 'transfer') {
          callbacks.onQuantityChange(item.transfer_quantity, item);
        } else if (type === 'spoilage') {
          callbacks.onQuantityChange(item.consumption_quantity, item);
        }
      });

      ElMessage.success(t('common.addSuccess'));

      return scanData;
    }
    return null;
  };

  //切换使用外部的数据
  const switchToExternalData = (data: any[]) => {
    productSelectList.value = data;
    isUsingExternalData.value = true;
  };

  // 切换使用内部数据
  const switchToInternal = () => {
    isUsingExternalData.value = false;
    getSkuProductList();
  };

  const skuGroups = ref<Map<string, number[]>>(new Map());

  const updateSkuGroups = (productList: any[]) => {
    const groupMap = new Map<string, number[]>();

    productList.forEach((item, index) => {
      if (item.product_barcode) {
        if (!groupMap.has(item.product_barcode)) {
          groupMap.set(item.product_barcode, []);
        }
        groupMap.get(item.product_barcode)?.push(index);
      }
    });

    skuGroups.value = groupMap;
  };

  const objectSpanMethod = (
    { row, column, rowIndex, columnIndex }: SpanMethodProps,
    displayColumns: any[],
  ) => {
    const columnProp = displayColumns[columnIndex]?.prop;

    if (!columnProp || !['stock_warning_quantity'].includes(columnProp)) {
      return undefined;
    }

    const currentGroupCode = row.product_barcode;
    if (!currentGroupCode) return undefined;

    const group = skuGroups.value.get(currentGroupCode);
    if (!group || group.length <= 1) return undefined;

    const posInGroup = group.indexOf(rowIndex);
    if (posInGroup === -1) return undefined;

    if (posInGroup === 0) {
      return {
        rowspan: group.length,
        colspan: 1,
      };
    }

    return {
      rowspan: 0,
      colspan: 0,
    };
  };

  if (shouldUseWarehouseAPI.value) {
    getSkuProductList();
  } else if (!isUsingExternalData.value) {
    getSkuProductList();
  }

  return {
    productSelectList,
    filterProductSku,
    getSkuProductList,
    safeParseFloat,
    calculateTax,
    handleBarcodeScan,
    switchToExternalData,
    switchToInternal,
    currentWarehouseId,
    updateWarehouseId,
    skuGroups,
    updateSkuGroups,
    objectSpanMethod,
  };
};
