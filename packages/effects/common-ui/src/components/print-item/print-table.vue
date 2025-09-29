<script setup lang="ts">
import { computed } from 'vue';

import { processAffixedValue } from '@igourd/utils';

const props = defineProps({
  itemStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
  value: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
  elementData: {
    type: Object,
    default: () => {},
  },
  tableData: {
    type: Array,
    default: () => [],
  },
});

const orderList = computed(() => {
  if (props.value.length > 0) {
    return props.value;
  }
  return [
    {
      id: 1,
      selling_price: '¥10.00 ',
      product_name: '商品1',
      quantity: 2,
      subtotal_amount: '¥20.00',
    },
  ];
});
// 获取表头样式
const getHeaderItemStyle = (item) => {
  return {
    width: item?.width || 'auto',
    textAlign: item?.align || 'center',
  };
};

// 获取单元格样式
const getCellStyle = (col) => {
  return {
    width: col?.width || 'auto',
    textAlign: col?.align || 'center',
  };
};
</script>
<template>
  <div class="print-table">
    <!-- 表头 -->
    <div
      class="print-table-header"
      :style="{
        borderBottom: `1px ${
          props.itemStyle ? props.itemStyle.border : 'dashed'
        } #333`,
      }"
    >
      <div
        v-for="(item, index) in props.elementData.column_option_code"
        :key="index"
        class="print-table-header-item"
        :style="getHeaderItemStyle(item.column_option_code)"
        style="width: 25%; word-break: break-all"
      >
        {{ item.name }}
      </div>
    </div>
    <!-- 表格内容 -->
    <div class="print-table-body">
      <div
        v-for="(row, rowIndex) in orderList"
        :key="rowIndex"
        class="print-table-row"
        :style="{
          borderBottom:
            rowIndex + 1 != orderList.length
              ? `1px ${
                  props.itemStyle ? props.itemStyle.border : 'dashed'
                } #333`
              : 'none',
        }"
      >
        <div
          v-for="(col, colIndex) in props.elementData.column_option_code"
          :key="colIndex"
          class="print-table-cell"
          :style="getCellStyle(col.column_option_code)"
        >
          {{
            processAffixedValue(
              row[col.column_option_code],
              col.prefix,
              false,
              col.storeInfo,
            )
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.print-table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
}

.print-table-header {
  display: flex;
  font-weight: bold;
  background-color: #f5f5f5;
}

.print-table-header-item {
  flex: 1;
  padding: 8px;
}

.print-table-body {
  width: 100%;
}

.print-table-row {
  display: flex;
}

.print-table-cell {
  flex: 1;
  padding: 8px;
}
</style>
