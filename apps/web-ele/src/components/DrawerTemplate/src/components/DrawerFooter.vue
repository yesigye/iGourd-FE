<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import { computed } from 'vue';

import { ElButton } from 'element-plus';

import { footerProps } from '../props';

defineOptions({ name: 'BasicDrawerFooter' });

const props = defineProps({
  ...footerProps,
  height: {
    type: String,
    default: '60px',
  },
});
const emit = defineEmits(['ok', 'close']);

const getStyle = computed((): CSSProperties => {
  const heightStr = `${props.height}`;
  return {
    height: heightStr,
    lineHeight: `calc(${heightStr} - 1px)`,
    textAlign: 'center',
    borderTop: '1px solid rgba(5, 5, 5, 0.06)',
  };
});

function handleOk() {
  emit('ok');
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div
    v-if="showFooter || $slots.footer"
    class="border-t-1 border-light-200 dark:bg-dark hly-footer absolute bottom-0 left-0 w-full bg-white pl-5 pr-3"
    :style="getStyle"
  >
    <template v-if="!$slots.footer">
      <slot name="insertFooter"></slot>
      <ElButton
        v-if="showCancelBtn"
        v-bind="cancelButtonProps"
        class="hly-footer-cancel mr-2"
        @click="handleClose"
      >
        {{ $t(cancelText) }}
      </ElButton>
      <slot name="centerFooter"></slot>
      <ElButton
        v-if="showOkBtn"
        :type="okType"
        v-bind="okButtonProps"
        class="hly-footer-confirm mr-2"
        :loading="confirmLoading"
        @click="handleOk"
      >
        {{ $t(okText) }}
      </ElButton>
      <slot name="appendFooter"></slot>
    </template>

    <template v-else>
      <slot name="footer"></slot>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.hly-footer {
  &-cancel {
    width: 160px;
    height: 50px;
    background-color: #dfdfdf;
  }

  &-confirm {
    width: 160px;
    height: 50px;
    background-color: #0d99ff;
  }
}
</style>
