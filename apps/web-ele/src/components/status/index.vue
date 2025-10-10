<script lang="ts" setup>
import { computed } from 'vue';

interface StatusItem {
  name: string;
  value: string;
  iconColor: string;
  textColor?: string;
  showUnderline?: boolean;
  isI18n?: boolean;
}

interface PropsType {
  isI18n?: boolean;
  value: number | string;
  // eslint-disable-next-line vue/no-required-prop-with-default
  statusList: StatusItem[];
  // eslint-disable-next-line vue/require-default-prop
  event?: Record<string, () => void>;
}

// 定义子组件传递参数，设置默认值
const props = withDefaults(defineProps<PropsType>(), {
  isI18n: true,
  statusList: () => [],
});

const statusItem = computed<StatusItem>(() => {
  return (
    (props.statusList || []).find((item) => item.value === props.value) ||
    ({} as StatusItem)
  );
});

const handleClick = () => {
  props.event?.onClick?.();
};
</script>
<template>
  <div class="status">
    <template v-if="statusItem?.value">
      <span
        v-if="statusItem?.iconColor"
        class="status-icon"
        :style="{ backgroundColor: statusItem?.iconColor }"
      ></span>
      <span
        class="status-text"
        :class="[{ underline: statusItem?.showUnderline }]"
        :style="{ color: statusItem?.textColor || '#323232' }"
        @click="handleClick"
      >
        <template v-if="isI18n">
          {{ $t(statusItem.name) }}
        </template>
        <template>{{ statusItem.name }}</template>
      </span>
    </template>
    <template v-else>-</template>
  </div>
</template>

<style lang="scss" scoped>
.status {
  display: flex;
  align-items: center;

  &-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  &-text {
    box-sizing: border-box;
    flex: 1;
    padding-left: 5px;

    &.underline {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
