<script lang="ts" setup>
// 组件
import { ElButton } from '@igourd/common-ui';
import { useI18n } from '@igourd/locales';

const props = defineProps({
  carryForwardButton: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(['previousStep', 'carryForward']);

const { t } = useI18n();

const handPreviousStep = () => {
  emits('previousStep');
};
const handCarryForward = () => {
  emits('carryForward');
};
</script>
<template>
  <div class="flex items-center justify-center gap-2.5">
    <ElButton :plain="true" type="primary" @click="handPreviousStep()">
      {{ t('final-transfer.previous-step') }}
    </ElButton>
    <ElButton
      v-if="props.carryForwardButton"
      type="primary"
      @click="handCarryForward()"
    >
      {{ t('final-transfer.carry-forward') }}
    </ElButton>
  </div>
</template>
