<template>
  <el-input
    :model-value="displayValue"
    @input="onInput"
    @change="onChange"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElInput } from '@igourd/common-ui';

const props = withDefaults(
  defineProps<{
    modelValue?: number | null;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
  }>(),
  {
    modelValue: null,
    placeholder: '',
    disabled: false,
    readonly: false,
    clearable: false
  }
);

const emits = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
  (e: 'change', value: number | null): void;
}>();

const inputValue = ref('');

function formatThousand(value: string): string {
  if (!value) return '';
  const parts = value.split('.');
  //@ts-ignore
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function parseThousand(value: string): number | null {
  if (!value) return null;
  const cleanValue = value.replace(/,/g, '');
  const num = parseFloat(cleanValue);
  return isNaN(num) ? null : num;
}

const displayValue = computed(() => {
  return formatThousand(inputValue.value);
});

watch(
  () => props.modelValue,
  newVal => {
    if (newVal !== undefined && newVal !== null) {
      inputValue.value = newVal.toString();
    } else {
      inputValue.value = '';
    }
  },
  { immediate: true }
);

function onInput(val: string) {
  // 移除所有非数字、小数点和负号的字符
  const cleanVal = val.replace(/[^\d.-]/g, '');
  // 确保只有一个小数点和一个负号（如果有的话）
  const parts = cleanVal.split('.');
  //@ts-ignore
  const integerPart = parts[0].replace(/^(-?)/, '$1').replace(/-/g, '');
  const decimalPart = parts.length > 1 ? '.' + parts.slice(1).join('') : '';

  inputValue.value = integerPart + decimalPart;

  const parsed = parseThousand(inputValue.value);
  emits('update:modelValue', parsed);
}

function onChange(val: string) {
  const parsed = parseThousand(val);
  emits('change', parsed);
}

// 初始化 inputValue
inputValue.value = props.modelValue !== undefined && props.modelValue !== null ? props.modelValue.toString() : '';
</script>

<style scoped></style>
