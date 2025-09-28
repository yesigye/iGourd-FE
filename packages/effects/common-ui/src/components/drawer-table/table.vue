<script setup lang="ts">
import type { ModalProps } from '@igourd-core/popup-ui';

import {} from '@igourd/icons';

import { useIgourdModal } from '@igourd-core/popup-ui';

interface GirdTabProps {
  name: string;
  grid:
}

interface ModalTableProps extends ModalProps {
  modelValue: number | number[] | string | string[];
  text: string;
  tabs: GirdTabProps[];
}
const props = defineProps<Partial<ModalTableProps>>();

const [Modal, modalApi] = useIgourdModal(props);
</script>
<template>
  <div>
    <slot name="reference">
      <div class="bg-primary-background-light color-primary">
        <SquareMousePointer />
        {{ props.text }}
      </div>
    </slot>
    <Modal>
      <ElTable />
    </Modal>
  </div>
</template>
