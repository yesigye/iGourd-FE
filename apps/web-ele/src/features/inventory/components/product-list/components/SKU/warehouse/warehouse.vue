<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';

import { ElOption, ElSelect } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

const props = defineProps({
  // 左侧与右侧展示的单位
  warehouseList: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
});
const emit = defineEmits(['change', 'addWarehouse', 'update:modelValue']);
const { t } = useI18n();
// 创建本地值用于双向绑定
const localValue = ref('');

// 监听 props 中的 modelValue 变化，更新本地值
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  },
  { immediate: true },
);

// 监听本地值变化，通知父组件
watch(
  () => localValue.value,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
);

const changeWarehouse = (val: any) => {
  emit('change', val);
};

const handleAddWarehouse = () => {
  emit('addWarehouse');
};

onMounted(() => {
  // 初始化本地值
  localValue.value = props.modelValue;
});
</script>
<template>
  <ElSelect
    v-model="localValue"
    :placeholder="placeholder"
    @change="changeWarehouse"
  >
    <ElOption
      v-for="item in props.warehouseList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
    <template #footer>
      <div
        style="
          padding: 8px;
          text-align: center;
          cursor: pointer;
          border-top: 1px solid #ebeef5;
        "
        @click="handleAddWarehouse"
      >
        <i class="iconfont icon-tianjia-dianpu"></i>
        <span class=""> {{ t('inventory.add-warehouse') }} </span>
      </div>
    </template>
  </ElSelect>
</template>
