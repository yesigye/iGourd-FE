<script setup lang="ts">
import type { ModalProps } from '@igourd/common-ui';

import type { VxeTableGridOptions } from '../vxe-table';

import { useIgourdModal } from '@igourd/common-ui';
import { SquareMousePointer } from '@igourd/icons';

interface GirdTabProps {
  name: string;
  grid: VxeTableGridOptions;
}

interface ModalTableProps extends ModalProps {
  modelValue: number | number[] | string | string[];
  text: string;
  tabs: GirdTabProps[];
  grid: VxeTableGridOptions;
}
const props = defineProps<Partial<ModalTableProps>>();

const [Modal, modalApi] = useIgourdModal(props);
</script>
<template>
  <div>
    <slot name="reference">
      <div
        class="bg-primary-background-light color-primary"
        @click="modalApi.open()"
      >
        <SquareMousePointer />
        {{ props.text }}
      </div>
    </slot>
    <Modal>
      <ElTable />
    </Modal>
  </div>
</template>
