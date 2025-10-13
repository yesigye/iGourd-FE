<script>
import { computed, ref, watch } from 'vue';

import { ElCheckbox, ElOption, ElSelect } from '@igourd/common-ui';
import { compact } from '@igourd/utils';

export default {
  name: 'SelectWithCheckbox',
  components: {
    ElOption,
    ElSelect,
    ElCheckbox,
  },
  props: {
    initialOptions: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    specInfo: {
      type: Object,
      default: () => null,
    },
    disableItems: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'add-spec-value'],
  setup(props, { emit }) {
    const options = ref(props.initialOptions);
    const selectedValuesLocal = ref([...props.modelValue]);
    const selectRef = ref(null);
    const isAddingSpecValue = ref(false);

    // 监听到父节点的变化
    watch(
      () => props.modelValue,
      (newVal) => {
        const newValues = Array.isArray(newVal) ? [...newVal] : [];
        if (
          JSON.stringify(newValues) !==
          JSON.stringify(selectedValuesLocal.value)
        ) {
          selectedValuesLocal.value = newValues;
        }
      },
      { immediate: true, deep: true },
    );

    // 监听本地改变发送父节点
    watch(
      selectedValuesLocal,
      (newVal) => {
        emit('update:modelValue', [...newVal]);
      },
      { deep: true },
    );

    const isAllSelected = computed(() => {
      return (
        options.value.length > 0 &&
        selectedValuesLocal.value.length === options.value.length
      );
    });

    const isIndeterminate = computed(() => {
      return (
        selectedValuesLocal.value.length > 0 &&
        selectedValuesLocal.value.length < options.value.length
      );
    });

    const handleCheckAllChange = (val) => {
      selectedValuesLocal.value = val
        ? options.value.map((item) => item.value)
        : compact(
            options.value.map((it) => {
              if (
                props.disableItems.includes(it.value) ||
                props.disableItems.includes(String(it.value))
              )
                return it.value;
              return '';
            }) ?? [],
          );
    };

    const handleItemChange = (checked, value) => {
      if (props?.disableItems?.includes(value)) return;
      if (checked) {
        if (!selectedValuesLocal.value.includes(value)) {
          selectedValuesLocal.value = [...selectedValuesLocal.value, value];
        }
      } else {
        selectedValuesLocal.value = selectedValuesLocal.value.filter(
          (v) => v !== value,
        );
      }
    };

    const handleAddClick = () => {
      // 标记正在添加规格值
      isAddingSpecValue.value = true;

      // 关闭下拉菜单
      if (selectRef.value) {
        selectRef.value.blur();
      }

      // 发射事件
      emit('add-spec-value', props.specInfo);
    };

    const handleVisibleChange = (visible) => {
      // 如果是因为点击添加规格值按钮而关闭的下拉框，则不做特殊处理
      if (!visible && isAddingSpecValue.value) {
        isAddingSpecValue.value = false;
        return;
      }

      // 如果下拉框即将显示，重置添加标记
      if (visible) {
        isAddingSpecValue.value = false;
      }
    };

    const handleFilterChange = (val) => {};

    // 父节点改变更新
    watch(
      () => props.initialOptions,
      (newVal) => {
        options.value = [...newVal];
      },
      { deep: true },
    );

    return {
      options,
      selectedValuesLocal,
      isAllSelected,
      isIndeterminate,
      handleCheckAllChange,
      handleItemChange,
      handleFilterChange,
      handleAddClick,
      handleVisibleChange,
      selectRef,
    };
  },
};
</script>

<template>
  <ElSelect
    ref="selectRef"
    v-model="selectedValuesLocal"
    multiple
    filterable
    collapse-tags
    :max-collapse-tags="3"
    :placeholder="$t('common.select')"
    class="relative w-full"
    @filter-change="handleFilterChange"
    @visible-change="handleVisibleChange"
  >
    <div
      class="select-header pad-t-2 pad-b-2 pad-l-2.5 pad-r-2.5 border-lilac-mist border border-solid"
    >
      <ElCheckbox
        :model-value="isAllSelected"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        {{ $t('common.all') }}
      </ElCheckbox>
    </div>
    <ElOption
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="disableItems.includes(item.value)"
    >
      <div
        class="w-full"
        @click.stop="
          handleItemChange(
            !selectedValuesLocal.includes(item.value),
            item.value,
          )
        "
      >
        <ElCheckbox
          :model-value="selectedValuesLocal.includes(item.value)"
          :disabled="disableItems.includes(item.value)"
        >
          {{ item.label }}
        </ElCheckbox>
      </div>
    </ElOption>
    <template #footer>
      <div class="select-footer" @click.stop="handleAddClick">
        +{{ $t('inventory.spec_value') }}
      </div>
    </template>
  </ElSelect>
</template>

<style scoped>
.select-footer {
  padding: 8px 10px;
  font-size: 12px;
  color: #909399;
  text-align: center;
  cursor: pointer;
}
</style>
