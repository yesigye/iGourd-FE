<script setup lang="ts">
import { defineEmits, onMounted, ref } from 'vue';

// 单位比例组件
import { ElInput } from '@igourd/common-ui';

const props = defineProps({
  // 左侧与右侧展示的单位
  unitList: {
    type: Array as () => string[],
    default: () => [''],
  },
  ratioValue: {
    type: String,
    default: '0',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['inputChange']);

const unitRatio = ref(1);
// 比例切换
const changeRatio = (val) => {
  const numVal = Number(unitRatio.value);
  // 如果值小于等于0，自动设置为1
  if (numVal <= 0) {
    unitRatio.value = 1;
    emit('inputChange', 1);
  } else {
    emit('inputChange', unitRatio.value);
  }
};
onMounted(() => {
  if (props.ratioValue != '') {
    let shareValue = props.ratioValue.split(':')[1];
    if (!shareValue) {
      shareValue = '1';
    }
    unitRatio.value = Number(shareValue);
  }
});
</script>
<template>
  <div class="unit-ratio-container">
    <div class="unit-ratio-input-box">
      <div class="unit-ratio-input">
        <ElInput
          v-model="unitRatio"
          type="number"
          :disabled="props.disabled"
          placeholder="20"
          min="0.0001"
          step="0.1"
          @blur="changeRatio"
        />
      </div>
      <div>{{ props.unitList[0] || '' }}</div>
    </div>
    <div>=1{{ props.unitList[1] || '' }}</div>
  </div>
</template>
<style lang="scss">
.unit-ratio-container {
  display: flex;
  gap: 4px;
  align-items: center;
  width: 100%;
}

.unit-ratio-input-box {
  display: flex;
  gap: 2px;
  align-items: center;

  .unit-ratio-input {
    width: 120px;
  }
}
</style>
