<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import {
  ElButton,
  ElInput,
  ElMessage,
  ElTable,
  ElTableColumn,
} from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';
import { debounce, get } from '@igourd/utils';

import { allColumns } from '@@/sale/components/scan/const/sale.config';
import { Decimal } from 'decimal.js';

import { getSystemConfigurationDetailApi } from '#/api';
import { retainDecimal8 } from '#/utils/sale';

// interface
// props
const props = defineProps({
  mergeGoodsList: {
    type: Array,
    default: () => [],
  },
});
// emits
const emit = defineEmits([
  'update-quantity',
  'handleSelectRow',
  'DeleteGoods',
  'update-unit',
]);
const value = ref();
const options = ref([
  { id: 1, label: 'Option A', desc: 'Option A - 230506' },
  { id: 2, label: 'Option B', desc: 'Option B - 230506' },
  { id: 3, label: 'Option C', desc: 'Option C - 230506' },
  { id: 4, label: 'Option A', desc: 'Option A - 230507' },
]);
const goodsData = computed(() => props.mergeGoodsList);
// const columnsTable = computed(() => {
//   return allColumns.map(col => {
//     const { prop, ...item } = col;
//     const fieldValue = isFunction(prop) ? prop(item) : prop;
//     const suffix = isFunction(item?.labelSuffix) ? item?.labelSuffix : () => '';
//     return { ...item, field: fieldValue, label: `${t(item.key)} ${suffix(item)}` };
//   });
// });
const { t } = useI18n();
const tableRef = ref(null);
const rowSelection = ref([]);
// 商品的输入数量
const stock_total_quantity = ref(0);
const ableEdit = ref(false);
// 生命周期
function handleUnitChange(data) {
  const { product, unit } = data;

  const existingProductIndex = props.mergeGoodsList.findIndex(
    (item) =>
      item.sku_barcode === unit.sku_barcode &&
      item.product_unit_name === unit.product_unit_name &&
      item.id !== product.id,
  );

  if (existingProductIndex === -1) {
    emit('update-unit', product, unit);
  } else {
    const existingProduct = props.mergeGoodsList[existingProductIndex];
    emit('update-unit', product, unit, existingProduct);
  }
}

onMounted(() => {
  window.addEventListener('unit-change', (event: CustomEvent) =>
    handleUnitChange(event.detail),
  );
});

onUnmounted(() => {
  window.removeEventListener('unit-change', (event: CustomEvent) =>
    handleUnitChange(event.detail),
  );
});

// computed
const hasOffSaleItems = computed(() => {
  return props.mergeGoodsList?.some(
    (item) =>
      item.status === 'OFF_SALE' ||
      item.sale_warehouse_product_stock_quantity <= 0,
  );
});

// methods
const handleInputDebounced = debounce((row) => handleQuantityChange(row), 1000);

const handleQuantityChangeOriginal = (item: any) => {
  if (item.stock_total_quantity === null || item.stock_total_quantity === '') {
    item.stock_total_quantity = 0; // 默认值为0
    ElMessage.error(t('scan.please-input-quantity'));
  } else {
    const decimalQuantity = new Decimal(item.stock_total_quantity);
    item.stock_total_quantity = retainDecimal8(decimalQuantity, 8);
  }
  // 直接发送更新后的商品数据
  emit('update-quantity', item);
};

const handleQuantityChange = debounce(handleQuantityChangeOriginal, 500);

const handlePriceChangeOriginal = (val, row) => {
  row.custom_price = val;
  row.is_modify_price = true;
  // 转为数字进行比较
  if (Number(val) < 0 || val == 'e' || !isNumber(val) || val == '0-') {
    row.custom_price = null;
    return;
  }
  emit('update-quantity', row);
};

const handlePriceChange = debounce(handlePriceChangeOriginal, 500);

const getDetail = async () => {
  const res = await getSystemConfigurationDetailApi({});
  ableEdit.value = res.is_price_modify_support;
};
const handleSelectionChange = (val: any) => {
  console.log(val);
};

const handleSelect = (val: any) => {
  rowSelection.value = val;
  emit('handleSelectRow', val);
};

const handleDelete = (goodsId: number) => {
  emit('DeleteGoods', goodsId);
};
const isNumber = (val) => {
  const regPos = /^\d+.?\d*/; // 判断是否是数字。
  return !!regPos.test(val);
};

function increaseEventOriginal(row) {
  if (row.stock_total_quantity >= props.mergeGoodsList) {
    emit('update-quantity', row);
    return;
  }
  row.stock_total_quantity = retainDecimal8(row.stock_total_quantity + 1, 8);
  emit('update-quantity', row);
}

const increaseEvent = debounce(increaseEventOriginal, 300);

function decreaseEventOriginal(row) {
  if (row.stock_total_quantity <= 1) {
    row.stock_total_quantity = 0;
    emit('update-quantity', row);
    handleDelete(row.id);
    return;
  }
  row.stock_total_quantity = retainDecimal8(row.stock_total_quantity - 1, 8);
  emit('update-quantity', row);
}

const decreaseEvent = debounce(decreaseEventOriginal, 300);

function getRowClassName({ row }) {
  const classNames = ['scan-table-row'];
  if (
    row.status === 'OFF_SALE' ||
    row.sale_warehouse_product_stock_quantity <= 0
  ) {
    classNames.push('scan-table-error');
  } else {
    classNames.push('scan-table-success');
  }
  return classNames.join(' ');
}

getDetail();
defineExpose({
  stock_total_quantity,
  handleUnitChange,
  hasOffSaleItems,
});

// events
</script>

<template>
  <div class="scan-content h-full overflow-auto">
    <ElTable
      ref="tableRef"
      :data="mergeGoodsList || []"
      style="width: 100%"
      stripe
      border
      class="down-table-list"
      :header-cell-style="{
        background: '#F6F8FC',
        color: '#323232',
        height: '30px',
      }"
      :row-class-name="getRowClassName"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
    >
      <ElTableColumn
        v-for="(item, index) in allColumns"
        :key="index"
        :prop="item.prop"
        :label="t(`scan.${item.localKey}`)"
        :min-width="item.width || 'auto'"
        :align="item.align || 'left'"
        :fixed="item.fixed"
      >
        <template #default="{ column, row }">
          <template v-if="['stock_total_quantity'].includes(item.prop)">
            <div class="Inum">
              <ElButton class="Inum-input" @click="decreaseEvent(row)">
                -
              </ElButton>
              <ElInput
                v-model="row[item.prop]"
                v-input-number="8"
                @input="handleInputDebounced(row)"
                @keyup.enter="
                  (e) => {
                    e.preventDefault();
                    e.target.blur();
                  }
                "
              />
              <ElButton class="Inum-input" @click="increaseEvent(row)">
                +
              </ElButton>
            </div>
          </template>
          <template v-else-if="ableEdit && item.prop === 'selling_price'">
            <ElInput
              v-model="row.custom_price"
              v-input-number="8"
              class="input-number-control"
              :controls="false"
              :precision="2"
              @input="(val) => handlePriceChange(val, row)"
            />
          </template>
          <template v-else-if="item.render">
            <component
              :is="
                item.render({
                  item,
                  column,
                  row,
                  value: get(row, item.prop),
                  ableEdit,
                })
              "
            />
          </template>
        </template>
        <template #empty> </template>
      </ElTableColumn>
      <ElTableColumn
        v-auth="'sale_scan_code_delete'"
        :label="t('scan.action')"
        width="85"
        fixed="right"
        align="center"
      >
        <template #default="scope">
          <ElButton
            link
            type="primary"
            size="small"
            @click="handleDelete(scope.row.id)"
          >
            <i class="iconfont icon-shanchu2 shanchu"></i>
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<style scoped lang="scss">
.scan-content {
  :deep(.el-table--default .el-table__cell) {
    padding: 4px 0 !important;
  }

  // 移除 scoped，使用更具体的选择器
  :deep(.el-table) {
    .scan-table-row {
      &.scan-table-error {
        background-color: #ffd8d8 !important;

        td {
          background-color: #ffd8d8 !important;
        }

        // 确保条纹样式也被覆盖
        &.el-table__row--striped td {
          background-color: #ffd8d8 !important;
        }
      }
    }
  }
}

.Inum {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .Inum-input {
    width: 30px;
    height: 30px;
    font-size: 18px;
    font-weight: bold;
    color: #0d99ff;
    background-color: transparent;
    border-color: #0d99ff;
    border-radius: 0;
  }
}

.scan-table-row {
  &.scan-table-error {
    background-color: #fff3f3 !important;

    // Override stripe style
    &.el-table__row--striped {
      background-color: #fff3f3 !important;
    }
  }

  &.scan-table-success {
    // Default table styling applies
  }
}
</style>
