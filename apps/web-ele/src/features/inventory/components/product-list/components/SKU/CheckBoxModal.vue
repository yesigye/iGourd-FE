<script setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue';

import { ElButton, ElDialog } from '@igourd/common-ui';

import AddAndEditSpec from '../AddAndModifySpec/AddAndEditSpec.vue';
import CheckboxSelect from '../ChekboxList/CheckboxSelect.vue';

const props = defineProps({
  disableItems: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: 'Select Items',
  },
  visible: {
    type: Boolean,
    default: false,
  },
  initialOptions: {
    type: Array,
    default: () => [],
  },
  initialSelected: {
    type: Array,
    default: () => [],
  },
  currentSpec: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  'update:visible',
  'confirm',
  'cancel',
  'spec-value-added',
]);

const dialogVisible = ref(props.visible);
const options = ref(props.initialOptions);
const selectedValues = ref([...props.initialSelected]);
const specValueModalRef = ref(null);

const currentSpecInfo = computed(() => {
  return props.currentSpec
    ? {
        id: props.currentSpec.specId,
        name: props.currentSpec.specName,
        is_update_config: props.currentSpec.is_update_config,
      }
    : null;
});

watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal;
  },
);

watch(
  () => props.initialOptions,
  (newVal) => {
    options.value = newVal;
  },
);

watch(
  () => props.initialSelected,
  (newVal) => {
    selectedValues.value = Array.isArray(newVal) ? [...newVal] : [];
  },
  { immediate: true },
);

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
});

const handleValuesSelected = (values) => {
  selectedValues.value = values;
};

const handleConfirm = () => {
  emit('confirm', selectedValues.value);
  dialogVisible.value = false;
};

const handleCancel = () => {
  emit('cancel');
  dialogVisible.value = false;
};

const handleClose = () => {
  emit('cancel');
};

const handleAddSpecValue = (specInfo) => {
  if (specInfo && specInfo.id && specInfo.name) {
    specValueModalRef.value?.openAddSpecValue(specInfo.id, specInfo.name);
  }
};
// selectedValues
const handleSpecValueAdded = async (result) => {
  if (result.type === 'specValue' && result.action === 'add') {
    // 添加新的规格值并选中
    const newValue = {
      label: result.data.product_spec_value,
      value: result.data.id || `temp_${Date.now()}`,
      original: {
        id: result.data.id,
        product_spec_value: result.data.product_spec_value,
        product_spec_code: result.data.product_spec_code,
        product_spec_id: result.data.product_spec_id,
      },
    };

    options.value = [...options.value, newValue];
    selectedValues.value.push(result.data.id);

    // 更新规格值
    emit('spec-value-added', result.data);
  }
};
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    width="400px"
    :title="title"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <div>
      <CheckboxSelect
        v-model="selectedValues"
        :initial-options="options"
        :spec-info="currentSpecInfo"
        :disable-items="disableItems"
        @update:model-value="handleValuesSelected"
        @add-spec-value="handleAddSpecValue"
      />
      <div class="mt-5 text-right">
        <ElButton @click="handleCancel">
          {{ $t('common.cancel-btn') }}
        </ElButton>
        <ElButton type="primary" @click="handleConfirm">
          {{ $t('common.confirm-btn') }}
        </ElButton>
      </div>
    </div>
  </ElDialog>

  <AddAndEditSpec ref="specValueModalRef" @success="handleSpecValueAdded" />
</template>
