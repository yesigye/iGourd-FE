<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import {
  ElButton,
  ElCheckbox,
  ElIcon,
  ElInput,
  ElMessage,
  ElPopover,
} from '@igourd/common-ui';
import { CircleX } from '@igourd/icons';
import { useI18n } from '@igourd/locales';
import { debounce } from '@igourd/utils';

import { warehouseProductPageList } from '@@/inventory/apis';

const props = defineProps({
  initialQuantity: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'sale',
  },
  warehouseId: {
    type: [String, Number],
    default: '',
  },
});

const emit = defineEmits(['scan-complete', 'close']);

const { t } = useI18n();

const popoverVisible = ref(false);
const barcodeInputRef = ref<HTMLInputElement | null>(null);
const scanBuffer = ref('');
const isSearching = ref(false);

const barcodeForm = ref({
  code: '',
  quantity: props.initialQuantity || 0,
  enterQty: false,
});

const handleScannerInput = (event: KeyboardEvent) => {
  if (popoverVisible.value) {
    if (event.key === 'Enter') {
      if (scanBuffer.value.length > 0) {
        event.preventDefault();
        barcodeForm.value.code = scanBuffer.value;
        scanBuffer.value = '';
        handleSubmit();
      }
    } else if (event.key !== 'Shift' && event.key.length === 1) {
      scanBuffer.value += event.key;
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleScannerInput);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleScannerInput);
});

const showBarcodePopover = () => {
  popoverVisible.value = true;
  scanBuffer.value = '';
};

const closePopover = () => {
  popoverVisible.value = false;
  resetForm();
  scanBuffer.value = '';
};

const resetForm = () => {
  barcodeForm.value = {
    code: '',
    quantity: props.initialQuantity || 0,
    enterQty: false,
  };
};

const validateQuantityInput = () => {
  if (!barcodeForm.value.quantity) return;
  barcodeForm.value.quantity = barcodeForm.value.quantity
    .toString()
    .replaceAll(/[-.]/g, '');

  if (!barcodeForm.value.quantity) {
    barcodeForm.value.quantity = 1;
  }
};

const rawHandleSubmit = async () => {
  if (!barcodeForm.value.code) {
    barcodeForm.value.code = '';
    return;
  }

  isSearching.value = true;

  try {
    const results = await searchProductsByCode(barcodeForm.value.code);

    if (results) {
      emit('scan-complete', {
        product: results,
        quantity: barcodeForm.value.quantity,
      });

      const currentCode = barcodeForm.value.code;
      const currentQuantity = barcodeForm.value.quantity;
      barcodeForm.value.code = '';
      scanBuffer.value = '';
      barcodeForm.value.quantity =
        currentQuantity || props.initialQuantity || 0;

      setTimeout(() => {
        if (barcodeInputRef.value) {
          barcodeInputRef.value.focus();
        }
      }, 10);
    }
  } finally {
    isSearching.value = false;
  }
};

const handleSubmit = debounce(rawHandleSubmit, 500);

const handleSubmitQuantity = debounce(() => {
  if (barcodeForm.value.code != '') {
    // barcodeForm.value.enterQty = false;
    handleSubmit();
  }
}, 500);

const searchProductsByWarehouseAndCode = async (
  code: string,
  warehouseId: number | string,
) => {
  try {
    const params = {
      warehouse_id: warehouseId,
      page_num: 1,
      keywords: code,
      page_size: 10,
      status: 'ON_SALE',
    };
    const response = await warehouseProductPageList(params);

    if (response?.data?.list && response.data.list.length > 0) {
      return response.data.list;
    } else {
      ElMessage.warning(t('common.product-not-exist'));
      barcodeForm.value.code = '';
      return null;
    }
  } catch {
    ElMessage.error(t('inventory.errorFetchingProduct'));
    return null;
  }
};

const searchProductsByCode = async (code: string) => {
  try {
    // 特定类型API
    if (['physical', 'spoilage', 'transfer'].includes(props.type)) {
      if (!props.warehouseId) {
        ElMessage.warning(t('inventory.warehouseIdRequired'));
        return null;
      }
      return await searchProductsByWarehouseAndCode(code, props.warehouseId);
    }

    // 其他类型API
    const params = {
      business_type: ['purchase', 'receipt', 'return'].includes(props.type)
        ? 'PURCHASE'
        : 'OTHER',
      status: 'ON_SALE',
      keywords: code,
      page_num: 1,
      page_size: 10,
    };
    const response = await InventoryService.productSearch(params);

    if (response.data && response.data.list && response.data.list.length > 0) {
      return response.data.list;
    } else {
      ElMessage.warning(t('common.product-not-exist'));
      barcodeForm.value.code = '';
      return null;
    }
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    ElMessage.error(t('inventory.errorFetchingProduct'));
    return null;
  }
};
watch(
  () => barcodeForm.value.code,
  (newVal) => {
    const trimmed = newVal.trim();
    if (trimmed !== newVal) {
      barcodeForm.value.code = trimmed;
    }
  },
);

defineExpose({
  close: closePopover,
});
</script>

<template>
  <div class="header-box">
    <span>{{ $t(`common.purchase.major-name`) }}</span>
    <ElPopover
      :visible="popoverVisible"
      trigger="hover"
      placement="top"
      :width="450"
    >
      <!-- <el-popover placement="top" :width="450" v-model:visible="popoverVisible" @show="focusInput"> -->
      <template #reference>
        <ElButton
          @click.stop="showBarcodePopover"
          type="primary"
          size="small"
          plain
        >
          {{ $t('common.scan-code-entry') }}
        </ElButton>
      </template>

      <div class="barcode-popup">
        <div class="barcode-input">
          <div class="label">{{ $t('inventory.barcode') }}:</div>
          <ElInput
            maxlength="23"
            ref="barcodeInputRef"
            v-model="barcodeForm.code"
            placeholder="Enter"
            clearable
            style="width: 230px !important"
            @keydown.enter.native.prevent.stop="handleSubmit"
          />

          <ElInput
            v-if="barcodeForm.enterQty"
            v-model="barcodeForm.quantity"
            placeholder="1.00"
            type="number"
            style="width: 100px !important; margin: 0 10px"
            @keydown.enter.native.prevent.stop="handleSubmitQuantity"
            @input="validateQuantityInput"
          />
          <ElCheckbox style="margin-left: 10px" v-model="barcodeForm.enterQty">
            Enter Qty
          </ElCheckbox>
          <ElIcon
            @click="closePopover"
            class="styleVariant"
            style="margin-left: 5px"
          >
            <CircleX />
          </ElIcon>
        </div>
      </div>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.scan-code-entry {
  display: inline-block;
}

.barcode-input {
  display: flex;
  align-items: center;

  .label {
    margin-right: 8px;
    white-space: nowrap;
  }
}

:deep(
  .el-input__inner::-webkit-inner-spin-button,
  .el-input__inner::-webkit-outer-spin-button
) {
  margin: 0;
  appearance: none !important;
}

:deep(.el-input__inner) {
  appearance: textfield;
}
</style>
