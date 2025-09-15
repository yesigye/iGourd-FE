<script setup lang="ts">
import type { SpanMethodProps } from 'element-plus';

import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  nextTick,
  ref,
  watch,
} from 'vue';

import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElSelect,
  ElTable,
  ElTableColumn,
} from '@igourd/common-ui';
import { ArrowDown } from '@igourd/icons';
import { useI18n } from '@igourd/locales';
import { useUserStore } from '@igourd/stores';

import Decimal from 'decimal.js';

import { ScanCodeEntry } from '#/components';
import { retainDecimal8, stayFloatMul } from '#/utils';

import { getDefaultProductItem, useProductColumns } from './product.config';
import { useProductTable } from './useTable';

import style from './index.module.scss';

const props = defineProps({
  productList: {
    type: Array,
    required: true,
  },
  vatConfiguration: {
    type: String,
    default: 'NOT_APPLICATION',
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) =>
      [
        'default',
        'physical',
        'purchase',
        'receipt',
        'return',
        'stock',
        'transfer',
      ].includes(value),
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  customProductChange: {
    type: Function,
    default: null,
  },
  warehouseId: {
    type: [String, Number],
    default: '',
  },
  disableAllInputs: {
    type: Boolean,
    default: false,
  },
  purchaseOrderSelected: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  'update:productList',
  'calculations-updated',
  'quantity-change',
  'product-change',
]);
const { t } = useI18n();
const { currencySymbol } = useUserStore();
const productColumnsConfig = useProductColumns();

const displayColumns = computed(() => {
  return productColumnsConfig.getColumnsByType(props.type);
});

const {
  productSelectList,
  filterProductSku,
  safeParseFloat,
  calculateTax,
  handleBarcodeScan: handleBarcodeWithUtils,
  updateWarehouseId,
  updateSkuGroups,
  objectSpanMethod: spanMethod,
} = useProductTable(undefined, props.type, props.warehouseId);

const resetProductRow = (row: any) => {
  row.sub_product_stock_search_models = [];
  row.product = '';
  row.product_code = '';
  row.product_unit_code = '';
  row.product_barcode = '';
  row.cost_price = 0;
  row.enter_quantity = null;
  row.quantity = null;
  row.product_id = '';
  row.product_name = '';
  row.major_unit_name = '';
  row.remark = '';
  row.display_product = null;
  row.display_major_name = null;
  row.profile_photo = '';
  row.product_unit_name = null;
  row.major_name = null;
  row.product_spec_kvmessage = null;
  row.product_unit_id = null;
  row.product_profile_id = null;
  row.basic_unit_id = null;
  row.basic_unit_name = null;
  row.transfer_quantity = null;
  row.remaining_quantity = null;
  row.physical_quantity = null;
  row.stock_total_quantity = null;
  row.stock_total_quantity_message = null;

  if (props.type === 'stock') {
    row.stock_quantity = '';
    row.stock_add_quantity = '';
    row.stock_warning_quantity = '';
  }
};

const productChange = (val: any, row: any) => {
  if (val) {
    const productActive = productSelectList.value.find(
      (item) => item.id === val,
    );

    row.sub_product_stock_search_models =
      productActive.sub_product_stock_search_models;
    row.product_barcode = productActive.product_barcode;
    row.product_spec_kvmessage = productActive.product_spec_kvmessage;
    row.product_unit_code = productActive.product_unit_code;
    row.major_name = productActive.major_name;
    row.product_name = `${productActive.major_name}${productActive.product_spec_kvmessage ? `-${productActive.product_spec_kvmessage}` : ''}`;
    row.display_major_name = `${productActive.major_name}${productActive.product_spec_kvmessage ? `-${productActive.product_spec_kvmessage}` : ''}`;
    row.basic_unit_radio = productActive.basic_unit_radio;
    row.basic_unit_name = productActive.major_unit_name;
    row.sku_group_code = productActive.sku_group_code;
    row.basic_product_id = productActive.basic_product_id;
    row.sku_barcode = productActive.sku_barcode;
    row.merchant_id = productActive.merchant_id;
    row.product_unit_name = productActive.product_unit_name;
    row.major_unit_name = productActive.major_unit_name;
    row.product_unit_id = productActive.product_unit_id;
    row.product_profile_id = productActive.product_profile_id;
    row.basic_unit_id = productActive.major_unit_id;
    row.product_id = productActive.id;
    row.profile_photo = productActive.profile_photo;
    row.product_code = productActive.product_code;
    row.cost_price = productActive.cost_price;
    row.selling_price = productActive.selling_price;

    row.other_tax_amount = productActive.other_tax?.tax_amount || 0;
    row.vat_amount = productActive.vat_tax?.tax_amount || 0;
    row.vat_tax = productActive.vat_tax;
    row.other_tax = productActive.other_tax;
    row.stock_total_quantity = productActive?.stock_total_quantity;
    row.sale_warehouse_product_stock_quantity =
      productActive?.sale_warehouse_product_stock_quantity;
    row.stock_total_quantity_message =
      productActive?.stock_total_quantity_message;
    row.sale_warehouse_product_stock_quantity_message =
      productActive?.sale_warehouse_product_stock_quantity_message;
    row.enter_quantity = null;

    if (props.type === 'stock') {
      row.stock_quantity = '';
      if (!row.stock_add_quantity) row.stock_add_quantity = '';
      if (!row.stock_warning_quantity) row.stock_warning_quantity = '';
    }

    if (props.customProductChange) {
      const result = props.customProductChange(val, row);
      if (result === false) {
        resetProductRow(row);
        return;
      }
    }
  } else {
    ElMessage.warning(t('common.product_not_exist'));
    resetProductRow(row);
  }
  setTimeout(() => calculateTotals(), 100);
  emit('product-change', val, row);
};

const quantityChange = (val: number | string, row: any) => {
  const parsedVal = safeParseFloat(val);

  switch (props.type) {
    case 'physical': {
      row.physical_quantity = parsedVal;

      break;
    }
    case 'receipt': {
      row.received_quantity = parsedVal;
      row.quantity = parsedVal;
      row.enter_quantity = parsedVal;

      break;
    }
    case 'return': {
      row.returned_quantity = parsedVal;
      row.quantity = parsedVal;
      row.enter_quantity = parsedVal;

      break;
    }
    case 'spoilage': {
      row.consumption_quantity = parsedVal;

      break;
    }
    case 'stock': {
      row.stock_quantity = parsedVal;

      break;
    }
    case 'transfer': {
      row.transfer_quantity = parsedVal;

      break;
    }
    default: {
      row.quantity =
        row.basic_unit_radio && val
          ? parsedVal * safeParseFloat(row.basic_unit_radio)
          : parsedVal;
      if ('enter_quantity' in row) {
        row.enter_quantity = parsedVal;
        row.returned_quantity = parsedVal;
      }
    }
  }
  row.quantity = parsedVal;
  row.enter_quantity = parsedVal;
  calculateTotals();
};

const handleQuantityChangeLocal = (val: number | string, row: any) => {
  if (
    props.type === 'receipt' &&
    props.purchaseOrderSelected &&
    row.purchase_quantity !== undefined &&
    val > row.purchase_quantity
  ) {
    val = row.purchase_quantity;
  }
  if (
    props.type === 'return' &&
    row.received_quantity !== undefined &&
    val > row.received_quantity
  ) {
    val = row.received_quantity;
  }
  quantityChange(val, row);
  emit('quantity-change', val, row);
};
// 处理输入方法
const getQuantityValue = (row: any): null | number => {
  // 优先获取类型对应的字段,回退到通用字段
  if (props.type === 'receipt' && row.received_quantity !== undefined) {
    return row.received_quantity;
  }
  if (props.type === 'transfer' && row.transfer_quantity !== undefined) {
    return row.transfer_quantity;
  }
  if (props.type === 'physical' && row.physical_quantity !== undefined) {
    return row.physical_quantity;
  }
  return row.enter_quantity || row.quantity || null;
};

const updateQuantityValue = (val: number | string, row: any) => {
  const parsedVal = safeParseFloat(val);

  if (props.type === 'transfer') {
    row.transfer_quantity = parsedVal;
  } else if (props.type === 'physical') {
    row.physical_quantity = parsedVal;
  } else {
    row.enter_quantity = parsedVal;
  }

  handleQuantityChangeLocal(parsedVal, row);
};

const isShowDelete = computed(() => {
  if (props.readOnly) return false;
  if (props.productList.length === 1 && !props.productList[0].product_code) {
    return false;
  }
  return true;
});

const handleDelete = (index: number) => {
  if (props.readOnly) return;

  if (props.productList.length === 1) {
    emit('update:productList', [getDefaultProductItem()]);
  } else if (props.productList.length > 1) {
    ElMessageBox.confirm(
      t('inventory.confirmDeleteSelectedProducts'),
      t('purchase.deleteConfirmTitle'),
      {
        confirmButtonText: t('purchase.deleteConfirmBtn'),
        cancelButtonText: t('purchase.deleteCancelBtn'),
        type: 'warning',
        closeOnClickModal: false,
      },
    ).then(() => {
      const newList = [...props.productList];
      newList.splice(index, 1);
      emit('update:productList', newList);
      calculateTotals();
      ElMessage({
        type: 'success',
        message: 'ok',
      });
    });
  }
};

const handleAdd = (row: any) => {
  if (props.readOnly) return;

  if (row.product_code) {
    const newList = [...props.productList, getDefaultProductItem()];
    emit('update:productList', newList);
    calculateTotals();
  } else {
    ElMessage.warning(t('purchase.pleaseSelectProductCode'));
  }
};

const unitChange = (product: any, unitItem: any, newModels: any) => {
  if (props.readOnly) return;

  // product.sub_product_stock_search_models = product.sub_product_stock_search_models;
  product.product_barcode = unitItem.product_barcode;
  product.sku_barcode = unitItem.sku_barcode;
  product.product_spec_kvmessage = unitItem.product_spec_kvmessage;
  product.product_unit_code = unitItem.product_unit_code;
  product.major_name = unitItem.major_name;
  product.basic_unit_radio = unitItem.basic_unit_radio;
  product.display_major_name = `${unitItem.major_name}${unitItem.product_spec_kvmessage ? `-${unitItem.product_spec_kvmessage}` : ''}`;
  product.product_unit_name = unitItem.product_unit_name;
  product.major_unit_name = unitItem.major_unit_name;
  product.product_unit_id = unitItem.product_unit_id;
  product.product_id = unitItem.id;
  product.profile_photo = unitItem.profile_photo;
  product.product_code = unitItem.product_code;
  product.display_product = `${unitItem.product_code}-${unitItem.major_name}`;
  product.cost_price = unitItem.cost_price;
  product.other_tax_amount = unitItem.other_tax?.tax_amount || 0;
  product.vat_amount = unitItem.vat_tax?.tax_amount || 0;
  product.vat_tax = unitItem.vat_tax;
  product.other_tax = unitItem.other_tax;
  product.basic_unit_id = unitItem.major_unit_id;
  product.basic_unit_name = unitItem.major_unit_name;
  product.merchant_id = unitItem.merchant_id;
  product.product_profile_id = unitItem.product_profile_id;
  product.product_name = unitItem.major_name;
  product.stock_total_quantity = unitItem?.stock_total_quantity;
  product.stock_total_quantity_message = unitItem?.stock_total_quantity_message;
  if (props.type == 'transfer') {
    product.product_cost_price = unitItem.cost_price;
  }
  if (
    props.type == 'transfer' ||
    props.type == 'physical' ||
    props.type == 'spoilage'
  ) {
    product.enter_quantity = null;
    product.quantity = null;
  }

  product.display_product = unitItem;
  handleQuantityChangeLocal(product.enter_quantity, product);
};

const handleBarcodeScan = (scanData: any) => {
  if (props.readOnly) return;
  console.log('scanData', scanData);

  handleBarcodeWithUtils(scanData, props.productList, {
    onProductAdd: (newList: any[]) => {
      emit('update:productList', newList);
      calculateTotals();
    },
    onProductChange: productChange,
    onQuantityChange: (val: number | string, row: any) => {
      quantityChange(val, row);
      emit('quantity-change', val, row);
    },
  });
};

const scanCodeEntryRef = ref();

const closeBarcodeScanner = () => {
  if (scanCodeEntryRef.value) {
    scanCodeEntryRef.value[0]?.close();
  }
};

const calculateOrderItem = (item: any): any => {
  try {
    const quantity =
      props.type === 'receipt' && item.received_quantity !== undefined
        ? safeParseFloat(item.received_quantity)
        : safeParseFloat(item.enter_quantity || item.quantity);

    const costPrice = safeParseFloat(item.cost_price);
    const baseAmount = quantity * costPrice;
    let otherTaxAmount: number, vatAmount: number;

    const subtotalAmount = baseAmount;

    if (props.vatConfiguration === 'VAT_INCLUSIVE') {
      vatAmount = calculateTax(baseAmount, item?.vat_tax);
      otherTaxAmount = calculateTax(baseAmount, item?.other_tax);
    } else {
      vatAmount = 0;
      otherTaxAmount = 0;
    }

    const discountAmount =
      baseAmount * (safeParseFloat(item.discount_percentage || 0) / 100);

    const totalAmount =
      subtotalAmount + vatAmount + otherTaxAmount - discountAmount;

    return {
      ...item,
      subtotal_amount: subtotalAmount.toFixed(2),
      vat_amount: vatAmount.toFixed(2),
      other_tax_amount: otherTaxAmount.toFixed(2),
      discount_amount: discountAmount.toFixed(2),
      total_amount: totalAmount.toFixed(2),
    };
  } catch (error) {
    console.error('Item calculation error:', error);
    return {
      ...item,
      subtotal_amount: '0.00',
      vat_amount: '0.00',
      other_tax_amount: '0.00',
      discount_amount: '0.00',
      total_amount: '0.00',
    };
  }
};

// 计算总数
const calculateTotals = () => {
  try {
    const calculatedItems = props.productList.map((item) =>
      calculateOrderItem(item),
    );

    const totals = calculatedItems.reduce(
      (acc, item) => {
        return {
          subtotal: acc.subtotal + safeParseFloat(item.subtotal_amount),
          vat: acc.vat + safeParseFloat(item.vat_amount),
          otherTax: acc.otherTax + safeParseFloat(item.other_tax_amount),
          discount: acc.discount + safeParseFloat(item.discount_amount),
          total: acc.total + safeParseFloat(item.total_amount),
        };
      },
      { subtotal: 0, vat: 0, otherTax: 0, discount: 0, total: 0 },
    );

    // 计算税
    emit('calculations-updated', {
      subtotal_amount: Number(totals.subtotal.toFixed(2)),
      vat_amount: Number(totals.vat.toFixed(2)),
      other_tax_amount: Number(totals.otherTax.toFixed(2)),
      discount_amount: Number(totals.discount.toFixed(2)),
      total_amount: Number(totals.total.toFixed(2)),
      calculatedItems,
    });

    return totals;
  } catch (error) {
    console.error('Total calculation error:', error);
    return { subtotal: 0, vat: 0, otherTax: 0, discount: 0, total: 0 };
  }
};

watch(
  () => props.vatConfiguration,
  () => {
    calculateTotals();
  },
);

watch(
  () => props.productList,
  () => {
    nextTick(() => {
      updateSkuGroups(props.productList);
    });
  },
  { deep: true, immediate: true },
);

watch(
  () => props.warehouseId,
  (newWarehouseId) => {
    updateWarehouseId(newWarehouseId);
  },
  { immediate: true },
);

const handleStockQuantityChange = (row: any) => {
  calculateTotals();
  emit('quantity-change', row);
};

const resetAllProductRows = () => {
  const newList = [getDefaultProductItem()];
  emit('update:productList', newList);
};

const enabledFields = ref<{ fields: string[]; index: number }[]>([]);

// 禁用所有输入框
const isFieldDisabled = (index: number, fieldName: string): boolean => {
  if (!props.disableAllInputs) return props.readOnly;

  const rowConfig = enabledFields.value.find((item) => item.index === index);
  if (rowConfig && rowConfig.fields.includes(fieldName)) {
    return false;
  }

  return true;
};

// 禁用特定字段
const enableSpecificFields = (index: number, fields: string[]) => {
  if (index === -1) {
    const newEnabledFields = props.productList.map((_, i) => ({
      index: i,
      fields: [...fields],
    }));
    enabledFields.value = newEnabledFields;
  } else {
    enabledFields.value = enabledFields.value.filter(
      (item) => item.index !== index,
    );
    enabledFields.value.push({ index, fields });
  }
};
// productTableRef.value.enableSpecificFields(-1, ['major_name', 'quantity']);

const resetEnabledFields = () => {
  enabledFields.value = [];
};

const formatPurchaseQuantity = (row: any): string => {
  let quantityValue;

  if (props.type === 'receipt' && row.received_quantity !== undefined) {
    quantityValue = row.received_quantity;
  } else if (props.type === 'transfer' && row.transfer_quantity !== undefined) {
    quantityValue = row.transfer_quantity;
  } else if (props.type === 'physical' && row.physical_quantity !== undefined) {
    quantityValue = row.physical_quantity;
  } else if (props.type === 'return' && row.returned_quantity !== undefined) {
    quantityValue = row.returned_quantity;
  } else if (props.type === 'stock' && row.stock_add_quantity !== undefined) {
    quantityValue = row.stock_add_quantity;
  } else {
    quantityValue = row.quantity;
  }

  if (quantityValue && row.major_unit_name) {
    return `${(row.basic_unit_radio
      ? new Decimal(quantityValue).mul(row.basic_unit_radio)
      : new Decimal(quantityValue)
    ).toFixed(0)} ${row.major_unit_name}`;
  }
  return '';
};

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  return spanMethod(
    { row, column, rowIndex, columnIndex },
    displayColumns.value,
  );
};

interface ProductItem {
  product_id: number | string;
  product_name?: string;
  major_name?: string;
  [key: string]: any;
}

interface DuplicateItem {
  index: number;
  productId: number | string;
  productName: string;
  duplicateIndex: number;
}
// 重复的商品
const duplicateProductsList = ref([]);
const tableRowClassName = (event) => {
  return duplicateProductsList.value.some(
    (item) => item.productId === event.row.product_id,
  )
    ? style['error-row']
    : '';
};
const checkDuplicateProducts = () => {
  const duplicates: DuplicateItem[] = [];
  const productMap = new Map<number | string, number>();

  props.productList
    .filter((item: ProductItem) => item.product_id)
    .forEach((item: ProductItem, index: number) => {
      if (productMap.has(item.product_id)) {
        duplicates.push({
          index,
          productId: item.product_id,
          productName: item.product_name || item.major_name || '',
          duplicateIndex: productMap.get(item.product_id) as number,
        });
      } else {
        productMap.set(item.product_id, index);
      }
    });
  duplicateProductsList.value = duplicates;
  console.log('duplicateProductsList', duplicateProductsList.value);
  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
  };
};

defineExpose({
  resetProductRow,
  resetAllProductRows,
  enableSpecificFields,
  resetEnabledFields,
  isFieldDisabled,
  closeBarcodeScanner,
  updateSkuGroups,
  checkDuplicateProducts,
  calculateTotals,
});
</script>

<template>
  <div class="product-table">
    <ElTable
      :data="productList"
      style="width: 100%"
      stripe
      border
      class="down-table-list"
      :span-method="objectSpanMethod"
      :cell-class-name="tableRowClassName"
    >
      <template v-for="(column, index) in displayColumns" :key="index">
        <ElTableColumn
          v-if="column.prop === 'index'"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :align="column.align"
          :fixed="column.fixed"
        >
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-if="column.prop == 'product_code'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :min-width="column.width"
        >
          <template #default="scope">
            {{ scope.row[column.prop] }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop == 'major_name'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :min-width="column.width"
        >
          <template #header>
            <div class="header-box">
              <!-- <span>{{ t(`common.purchase.${column.prop}`) }}</span> -->
              <ScanCodeEntry
                ref="scanCodeEntryRef"
                :type="type"
                :warehouse-id="warehouseId"
                @scan-complete="handleBarcodeScan"
              />
            </div>
          </template>

          <template #default="scope">
            <ElSelect
              v-model="scope.row.display_major_name"
              class="bodernone search-type-drawer"
              popper-class="money-type"
              filterable
              clearable
              :disabled="isFieldDisabled(scope.$index, 'major_name')"
              :placeholder="$t('common.selectProduct')"
              :filter-method="filterProductSku"
              @change="(val) => productChange(val, scope.row)"
            >
              <ElOption
                v-for="(item, index) in productSelectList"
                :key="index"
                :value="item.id"
                :label="`${item.major_name}${item.product_spec_kvmessage ? `-${item.product_spec_kvmessage}` : ''}`"
              >
                <div class="product-box">
                  <div>
                    <span v-if="item.product_code">{{ item.product_code }}-</span>
                    <span>{{ item.major_name }}</span>
                    <span>{{
                      item.product_spec_kvmessage
                        ? `-${item.product_spec_kvmessage}`
                        : ''
                    }}</span>
                  </div>
                </div>
              </ElOption>
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop == 'product_unit_code'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
        >
          <template #default="scope">
            {{ scope.row[column.prop] }}
          </template>
        </ElTableColumn>

        <ElTableColumn
          v-else-if="column.prop == 'basic_unit_radio'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
        >
          <template #default="scope">
            <template v-if="scope.row.basic_unit_radio">
              1: {{ scope.row.basic_unit_radio }}
            </template>
          </template>
        </ElTableColumn>

        <ElTableColumn
          v-else-if="column.prop == 'cost_price'"
          :prop="column.prop"
          :label="`${t(`common.purchase.${column.prop}`)}(${currencySymbol})`"
          :width="column.width"
          placeholder=""
        >
          <template #default="scope">
            {{ scope.row[column.prop] }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop == 'profile_photo'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
          :fixed="column.fixed"
          :align="column.align"
        >
          <template #default="scope">
            <el-image
              fit="cover"
              class="product-pic"
              alt="Image"
              :src="scope.row.product"
              :preview-src-list="[scope.row.product]"
              :initial-index="0"
              :preview-teleported="true"
            >
              <template #error>
                <div class="image-slot">
                  <img alt="" class="product-pic" />
                </div>
              </template>
            </el-image>
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="
            column.prop === 'enter_quantity' ||
            column.prop === 'transfer_quantity'
          "
          :prop="column.prop"
          :label="t(`common.purchase.quantity`)"
          :width="column.width"
        >
          <template #default="scope">
            <ElInput
              v-input-number="8"
              class="input-number-control"
              :placeholder="$t('purchase.pleaseEnterQuantity')"
              :controls="false"
              :disabled="isFieldDisabled(scope.$index, 'enter_quantity')"
              style="width: 100%"
              :model-value="getQuantityValue(scope.row)"
              @input="(val) => handleQuantityChangeLocal(val, scope.row)"
              @update:model-value="(val) => updateQuantityValue(val, scope.row)"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop == 'sub_product_stock_search_models'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
          class="unit-select"
        >
          <template #default="scope">
            <ElDropdown
              v-if="type !== 'receipt' || !purchaseOrderSelected"
              popper-class="unit-dropdown"
            >
              <span class="el-dropdown-link">
                {{ scope.row.product_unit_name }}
                <ElIcon
                  v-if="scope.row[column.prop]?.length > 0"
                  class="el-icon--right"
                >
                  <ArrowDown />
                </ElIcon>
              </span>

              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem
                    v-for="item in scope.row[column.prop]"
                    :key="item?.id"
                    @click="
                      () =>
                        unitChange(
                          scope.row,
                          item,
                          item.sub_product_stock_search_models,
                        )
                    "
                  >
                    <div
                      class="unit-item"
                      style="width: 300px; overflow: scroll"
                    >
                      <span>{{ item.product_unit_name }}</span>
                      <span v-if="item.basic_unit_radio"
                        >1:{{ item.basic_unit_radio }}</span
                      >
                    </div>
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
            <span v-else>{{ scope.row.product_unit_name }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop === 'actual_quantity'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
          :align="column.align"
          :fixed="column.fixed"
        >
          <template #default="scope">
            {{
              scope.row.basic_unit_radio &&
              scope.row.quantity &&
              retainDecimal8(
                stayFloatMul(
                  scope.row.basic_unit_radio,
                  retainDecimal8(scope.row.quantity, 8),
                ),
                8,
              )
            }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop === 'purchase_qty'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
          :align="column.align"
          :fixed="column.fixed"
        >
          <template #default="scope">
            {{ scope.row[column.prop] }}
            {{ formatPurchaseQuantity(scope.row) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop === 'sale_warehouse_product_stock_quantity'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
          :align="column.align"
          :fixed="column.fixed"
        >
          <template #default="scope">
            {{ scope.row[column.prop] }} {{ scope.row.major_unit_name }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="
            column.prop == 'sale_warehouse_product_stock_quantity_message'
          "
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
          :align="column.align"
          :fixed="column.fixed"
        >
          <template #default="scope"> {{ scope.row[column.prop] }} </template>
        </ElTableColumn>

        <ElTableColumn
          v-else-if="column.prop == 'stock_add_quantity'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
        >
          <template #default="scope">
            <ElInput
              v-if="!readOnly"
              v-model="scope.row.stock_add_quantity"
              v-input-number="8"
              class="input-number-control"
              :placeholder="$t('inventory.stock_add_quantity')"
              :controls="false"
              style="width: 100%"
              @input="() => handleStockQuantityChange(scope.row)"
            />
            <span v-else>{{ scope.row.stock_add_quantity }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop == 'stock_warning_quantity'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
        >
          <template #default="scope">
            <ElInput
              v-if="!readOnly"
              v-model="scope.row.stock_warning_quantity"
              v-input-number="8"
              class="input-number-control"
              :placeholder="$t('inventory.stock_warning_quantity')"
              :controls="false"
              style="width: 100%"
              @input="() => handleStockQuantityChange(scope.row)"
            />
            <span v-else>{{ scope.row.stock_warning_quantity }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          v-else-if="column.prop != 'index'"
          :prop="column.prop"
          :label="t(`common.purchase.${column.prop}`)"
          :width="column.width"
        >
          <template #default="scope">
            <ElInput
              v-model="scope.row[column.prop]"
              v-rpSymbol
              disabled
              maxlength="64"
            />
          </template>
        </ElTableColumn>
        <!-- Stock -->
      </template>
      <ElTableColumn
        :label="t(`common.purchase.action`)"
        width="100"
        align="center"
        fixed="right"
      >
        <template #default="scope">
          <ElButton
            v-if="isShowDelete"
            link
            type="primary"
            size="small"
            @click.prevent="handleDelete(scope.$index)"
          >
            <i class="iconfont icon-shanchu2 shanchu-red"></i>
          </ElButton>
          <ElButton
            v-if="scope.$index === productList.length - 1"
            link
            type="primary"
            size="small"
            @click="handleAdd(scope.row)"
          >
            <i class="iconfont icon-tianjia"></i>
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<style lang="scss" scoped>
.product-table {
  width: 100%;
}

.product-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-pic {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.unit-item {
  display: flex;
  justify-content: space-between;
}

.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
