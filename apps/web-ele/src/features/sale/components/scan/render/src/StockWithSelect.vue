<script setup lang="ts">
import type { PropType } from 'vue';

import { computed, onBeforeUnmount, ref } from 'vue';

import { ElOption, ElSelect } from '@igourd/common-ui';

import { warehouseStockListApi } from '@@/sale/apis';
import { storeToRefs } from 'pinia';

import { useOrderStore } from '#/store/sale/order';

import Stock from './Stock.vue';

const props = defineProps({
  detailInfo: {
    type: Object,
    required: true,
  },
  warehouseOptions: {
    type: Array as PropType<WarehouseOption[]>,
    default: () => [],
  },
});

const emit = defineEmits(['change']);

// 仓库列表缓存
const warehouseListCache = new Map();

interface WarehouseOption {
  warehouse_id: number;
  name: string;
  warehouse_name: string;
  stock_quantity: number;
}

const selectedWarehouse = ref(props.detailInfo?.warehouse_id);
const warehouseList = ref<WarehouseOption[]>([]);

// 当前选中仓库的信息
const currentWarehouseInfo = computed(() => {
  const selected = warehouseList.value.find(
    (w) => w.warehouse_id === selectedWarehouse.value,
  );
  if (!selected) return props.detailInfo;

  return {
    ...props.detailInfo,
    sale_warehouse_name: selected?.warehouse_name,
    sale_warehouse_id: selected?.warehouse_id,
    sale_warehouse_product_stock_quantity: selected?.stock_quantity,
  };
});

const getWarehouseList = async () => {
  try {
    const productId = props.detailInfo.id;

    // 检查缓存
    if (warehouseListCache.has(productId)) {
      warehouseList.value = warehouseListCache.get(productId);
      return;
    }

    const params = {
      id: productId,
    };
    const data = await warehouseStockListApi(params);
    warehouseList.value = data;

    // 缓存数据
    warehouseListCache.set(productId, data);
  } catch (error) {
    console.error('Failed to load warehouse list:', error);
  }
};

// 清除缓存
onBeforeUnmount(() => {
  warehouseListCache.clear();
});

const orderStore = useOrderStore();
const { mergeGoodsList } = storeToRefs(orderStore);

const handleChange = (value: number) => {
  selectedWarehouse.value = value;
  const selected = warehouseList.value.find((w) => w.warehouse_id === value);
  // 更新 store 中的商品仓库信息
  if (mergeGoodsList.value.length > 0) {
    const updatedMergeGoodsList = mergeGoodsList.value.map((item) => {
      if (item.id === props.detailInfo.id) {
        return {
          ...item,
          sale_warehouse_id: value,
          sale_warehouse_name: selected?.warehouse_name,
          sale_warehouse_product_stock_quantity: selected?.stock_quantity,
          sale_warehouse_product_stock_quantity_message:
            selected?.stock_quantity_message,
          warehouse_id: value,
          warehouse_name: selected?.warehouse_name,
        };
      }
      return item;
    });
    orderStore.setMergeGoodsList(updatedMergeGoodsList);
  }
  emit('change', value, selected?.warehouse_name);
};

const handleDropdownVisible = (visible: boolean) => {
  if (visible) {
    getWarehouseList();
  }
};
</script>

<template>
  <div style="display: flex; align-items: center">
    <div class="stock-with-select">
      <Stock :detail-info="currentWarehouseInfo" />
    </div>
    <div class="warehouse-select">
      <ElSelect
        v-model="selectedWarehouse"
        size="small"
        @change="handleChange"
        @visible-change="handleDropdownVisible"
      >
        <ElOption
          v-for="item in warehouseList"
          :key="item.warehouse_id"
          :label="item.name"
          :value="item.warehouse_id"
        >
          <div class="warehouse-option">
            <span>{{ item.warehouse_name }}-</span>
            <span class="stock-count">{{ item.stock_quantity_message }}</span>
          </div>
        </ElOption>
      </ElSelect>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stock-with-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.warehouse-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .stock-count {
    font-size: 12px;
    color: #999;
  }
}

.warehouse-select {
  width: 0;
}

.warehouse-select :deep(.el-select__wrapper) {
  padding: 0 !important;
}
</style>
