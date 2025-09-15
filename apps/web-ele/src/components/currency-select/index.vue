<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';

import { ElInput, ElSelect } from '@igourd/common-ui';

import { basicsCurrencyList } from '#/api';

// 属性
const props = defineProps({
  defaultValue: {
    type: String,
    default: '',
  },
  defaultInputValue: {
    type: String,
    default: '',
  },
  disabledSelect: {
    type: Boolean,
    default: false,
  },
  disabledInput: {
    type: Boolean,
    default: false,
  },
  isSelect: {
    type: Boolean,
    default: true,
  },
});
// 事件
const emit = defineEmits(['change']);

// 货币种
const currencyForm = ref({
  code: '',
  currencyValue: '',
});
// 金额
const CurrencyList = ref([]);
// 获取货币列表
const getCurrencyList = async () => {
  const [data, err] = await basicsCurrencyList({});
  if (!err) {
    CurrencyList.value = data;
  }
};
// 监听货币选择
watch(currencyForm.value, (newVal) => {
  const currencyData = CurrencyList.value.find(
    (item) => item.code === newVal.code,
  );
  emit('change', { ...newVal, currencyData: { ...currencyData } });
});
watchEffect(() => {
  if (props.defaultInputValue) {
    currencyForm.value.currencyValue = props.defaultInputValue;
  }
  if (props.defaultValue) {
    currencyForm.value.code = props.defaultValue;
  }
});

onMounted(() => {
  getCurrencyList();
});
</script>
<template>
  <ElInput
    v-model="currencyForm.currencyValue"
    clearable
    :disabled="props.disabledInput"
  >
    <template #prepend>
      <ElSelect
        v-if="props.isSelect"
        v-model="currencyForm.code"
        class="bodernone search-type-drawer w-25 bg-white"
        popper-class="money-type"
        filterable
        :disabled="props.disabledSelect"
      >
        <el-option
          v-for="item in CurrencyList"
          :key="item.code"
          class="rate-option"
          :value="item.code"
        >
          <div>
            <div class="flex justify-between">
              <span>{{ item.name }}</span>
              <span>{{ item.symbol }}</span>
            </div>
          </div>
        </el-option>
      </ElSelect>
      <span v-else>{{ currencyForm.code }}</span>
    </template>
  </ElInput>
</template>
