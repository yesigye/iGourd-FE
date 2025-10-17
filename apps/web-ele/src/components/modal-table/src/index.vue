<script setup lang="ts">
import { useIgourdModal } from '@igourd/common-ui';
import { SquareMousePointer } from '@igourd/icons';

const props = defineProps<{
  title: string;
  onBeforeOpen: () => Promise<boolean>;
}>();

const [Modal, modalApi] = useIgourdModal();

async function open() {
  await props.onBeforeOpen();
  modalApi.open();
}
</script>
<template>
  <div>
    {{ props.title }}
    <div class="igourd-trigger text-sm" @click="open()">
      <SquareMousePointer class="mr-1" />
      <slot name="reference"> </slot>
    </div>
    <Modal>
      <slot></slot>
    </Modal>
  </div>
</template>

<style scoped>
.igourd-trigger {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  height: 18px;
  padding: 0 10px;
  color: var(--primary, #1677ff);
  cursor: pointer;
  user-select: none;
  background: var(--primary-background-light, #f0f6ff);
  border-radius: 8px;
}
</style>
