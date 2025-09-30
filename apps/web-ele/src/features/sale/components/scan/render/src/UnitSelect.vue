<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { ArrowDown } from '@igourd/icons';

const props = defineProps({
  detailInfo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['unitChange']);

const unitOptions = ref([]);
const defaultUnit = ref('');
const selectedUnit = ref(null);

watch(
  () => props.detailInfo,
  () => {
    initUnitOptions();
  },
  { deep: true, immediate: true },
);

function initUnitOptions() {
  if (!props.detailInfo) return;
  defaultUnit.value = props.detailInfo.product_unit_name;
  const units = props.detailInfo.sub_product_stock_search_models || [];
  unitOptions.value = units;

  if (props.detailInfo.selectedUnit) {
    selectedUnit.value = props.detailInfo.selectedUnit;
  } else if (units.length > 0) {
    selectedUnit.value = units[0];
  }
}

function handleUnitChange(value) {
  selectedUnit.value = value;
  emit('unitChange', {
    product: props.detailInfo,
    unit: value,
  });
}

onMounted(() => {
  initUnitOptions();
});
</script>

<template>
  <div class="unit-select">
    <el-dropdown trigger="click" popper-class="unit-dropdown">
      <span class="el-dropdown-link">
        {{ defaultUnit }}
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </span>

      <template #dropdown>
        <el-dropdown-menu disabled>
          <el-dropdown-item
            v-for="item in unitOptions"
            :key="item.id || item.product_unit_id"
            @click="() => handleUnitChange(item)"
          >
            <div class="unit-item">
              <span>{{ item.product_unit_name }}</span>
              <span v-if="item.basic_unit_radio"
                >1:{{ item.basic_unit_radio }}</span
              >
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.unit-select {
  width: 100%;

  .el-dropdown-link {
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
  }

  .unit-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 300px;
    overflow: scroll;
  }
}
</style>
