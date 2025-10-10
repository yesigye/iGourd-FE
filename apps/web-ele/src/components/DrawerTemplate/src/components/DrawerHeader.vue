<script lang="ts" setup>
import { ArrowLeftBold } from '@element-plus/icons-vue';

import { BasicTitle } from '#/components/Basic';

defineOptions({ name: 'BasicDrawerHeader' });

withDefaults(defineProps<PropsType>(), {});
const emit = defineEmits(['close']);
interface PropsType {
  helpMessage?: string;
  isDetail: boolean;
  showDetailBack: boolean;
  title: string;
}
function handleClose() {
  emit('close');
}
</script>

<template>
  <BasicTitle
    v-if="!isDetail"
    :help-message="helpMessage"
    class="flex h-full items-center"
  >
    <slot name="title"></slot>
    {{ !$slots.title ? title : '' }}
  </BasicTitle>

  <div v-else>
    <span class="flex-1">
      <span v-if="showDetailBack" @click="handleClose">
        <ArrowLeftBold class="cursor-pointer px-3" />
      </span>
      <span v-if="title">{{ title }}</span>
    </span>

    <span class="pr-12.5">
      <slot name="titleToolbar"></slot>
    </span>
  </div>
</template>
