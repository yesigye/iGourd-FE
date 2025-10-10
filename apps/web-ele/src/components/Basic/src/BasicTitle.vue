<script lang="ts" setup>
import type { PropType } from 'vue';

import { computed, useSlots } from 'vue';

import { useDesign } from '#/common/hooks/web/useDesign';

import BasicHelp from './BasicHelp.vue';

const props = defineProps({
  /**
   * Help text list or string
   * @default: ''
   */
  helpMessage: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  /**
   * Whether the color block on the left side of the title
   * @default: false
   */
  span: { type: Boolean },
  /**
   * Whether to default the text, that is, not bold
   * @default: false
   */
  normal: { type: Boolean },
});

const { prefixCls } = useDesign('basic-title');
const slots = useSlots();
const getClass = computed(() => [
  prefixCls,
  { [`${prefixCls}-show-span`]: props.span && slots.default },
  { [`${prefixCls}-normal`]: props.normal },
]);
</script>

<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp
      v-if="helpMessage"
      :class="`${prefixCls}-help`"
      :text="helpMessage"
    />
  </span>
</template>

<style lang="scss" scoped>
.hly-basic-title {
  position: relative;
  display: flex;
  padding-left: 7px;
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
  color: #000;
  cursor: pointer;
  user-select: none;

  &-normal {
    font-size: 14px;
    font-weight: 500;
  }

  &-show-span::before {
    position: absolute;
    top: 4px;
    left: 0;
    width: 3px;
    height: 16px;
    margin-right: 4px;
    content: '';
  }

  &-help {
    margin-left: 10px;
  }
}
</style>
